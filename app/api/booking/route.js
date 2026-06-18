import { ObjectId } from 'mongodb'
import { isAdminRequest, unauthorized } from '../../lib/adminAuth'
import { createMongoClient, getRestaurantDb } from '../../lib/mongodb'
import { sendReservationCreatedEmail, sendReservationReceivedEmail, sendReservationStatusEmail } from '../../lib/email'

export const dynamic = 'force-dynamic'

const OPEN_TIME = '08:00'
const CLOSE_TIME = '23:59'
const LAST_TABLE_SEATING = '22:00'
const TABLE_SLOT_MINUTES = 120

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const client = createMongoClient()

  try {
    await client.connect()
    const database = getRestaurantDb(client)
    const reservations = database.collection('reservations')
    const result = await reservations.find({}).sort({ createdAt: -1 }).toArray()
    return Response.json(result)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to fetch reservations' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request) {
  const client = createMongoClient()

  try {
    const body = await request.json()
    const validationError = validateBooking(body)

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    const booking = {
      ...body,
      status: body.status || 'pending',
      createdAt: body.createdAt || new Date().toISOString(),
    }

    await client.connect()
    const database = getRestaurantDb(client)
    const reservations = database.collection('reservations')
    const availabilityError = await validateBookingAvailability(reservations, booking)

    if (availabilityError) {
      return Response.json({ error: availabilityError }, { status: 409 })
    }

    const result = await reservations.insertOne(booking)
    sendReservationCreatedEmail(booking).catch((emailError) => {
      console.error('Failed to send admin reservation email:', emailError)
    })
    sendReservationReceivedEmail(booking).catch((emailError) => {
      console.error('Failed to send guest reservation email:', emailError)
    })

    return Response.json({ message: 'Booking created', id: result.insertedId })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to create booking' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function PUT(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const client = createMongoClient()

  try {
    const body = await request.json()
    const { id, ...updateData } = body
    const normalizedUpdateData = {
      ...updateData,
      ...(updateData.tableId !== undefined ? { tableId: String(updateData.tableId || '') } : {}),
    }

    await client.connect()
    const database = getRestaurantDb(client)
    const reservations = database.collection('reservations')
    const existingReservation = await reservations.findOne({ _id: new ObjectId(id) })

    if (!existingReservation) {
      return Response.json({ error: 'Booking not found' }, { status: 404 })
    }

    const nextReservation = {
      ...existingReservation,
      ...normalizedUpdateData,
    }

    if (nextReservation.status === 'approved') {
      const approvalError = await validateApproval(database, reservations, nextReservation)

      if (approvalError) {
        return Response.json({ error: approvalError }, { status: 409 })
      }
    }

    await reservations.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          ...normalizedUpdateData,
          updatedAt: new Date().toISOString(),
        },
      },
    )

    if (normalizedUpdateData.status && normalizedUpdateData.status !== existingReservation.status) {
      sendReservationStatusEmail(nextReservation, normalizedUpdateData.status).catch((emailError) => {
        console.error('Failed to send reservation status email:', emailError)
      })
    }

    return Response.json({ message: 'Booking updated' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to update booking' }, { status: 500 })
  } finally {
    await client.close()
  }
}

function validateBooking(booking) {
  if (!booking.type || !['table', 'room'].includes(booking.type)) {
    return 'Booking type is required'
  }

  if (!booking.name || !booking.email || !booking.phone) {
    return 'Guest contact details are required'
  }

  if (booking.type === 'table') {
    if (!booking.date || !booking.time) {
      return 'Table date and time are required'
    }

    if (!isValidTableSeatingTime(booking.time)) {
      return `Table reservations must be between ${OPEN_TIME} and ${LAST_TABLE_SEATING}`
    }

    if (Number(booking.guests || 0) < 1) {
      return 'Guest count must be at least 1'
    }
  }

  if (booking.type === 'room') {
    if (!booking.roomId || !booking.roomName) {
      return 'Selected room is required'
    }

    if (!booking.checkIn || !booking.checkOut) {
      return 'Check-in and check-out dates are required'
    }

    if (!isValidStayRange(booking.checkIn, booking.checkOut)) {
      return 'Check-out must be after check-in'
    }

    if (Number(booking.guests || 0) < 1) {
      return 'Guest count must be at least 1'
    }
  }

  return ''
}

async function validateApproval(database, reservations, reservation) {
  if (reservation.type === 'table') {
    if (!isValidTableSeatingTime(reservation.time)) {
      return `Table reservation is outside seating hours (${OPEN_TIME}-${LAST_TABLE_SEATING})`
    }

    const capacityError = await validateTableCapacity(database, reservations, reservation)

    if (capacityError) {
      return capacityError
    }
  }

  if (reservation.type === 'room') {
    const hasConflict = await reservations.findOne({
      _id: { $ne: reservation._id },
      type: 'room',
      roomId: reservation.roomId,
      status: 'approved',
      checkIn: { $lt: reservation.checkOut },
      checkOut: { $gt: reservation.checkIn },
    })

    if (hasConflict) {
      return 'This room already has an approved booking for overlapping dates'
    }
  }

  return ''
}

async function validateBookingAvailability(reservations, booking) {
  if (booking.type !== 'room') {
    return ''
  }

  const hasConflict = await reservations.findOne({
    type: 'room',
    roomId: booking.roomId,
    status: 'approved',
    checkIn: { $lt: booking.checkOut },
    checkOut: { $gt: booking.checkIn },
  })

  if (hasConflict) {
    return 'This room is already booked for one or more selected nights'
  }

  return ''
}

function isTimeWithinOpeningHours(time) {
  return typeof time === 'string' && time >= OPEN_TIME && time <= CLOSE_TIME
}

function isValidTableSeatingTime(time) {
  return isTimeWithinOpeningHours(time) && time <= LAST_TABLE_SEATING
}

async function validateTableCapacity(database, reservations, reservation) {
  const tables = await database.collection('tables').find({}).toArray()
  const selectedTable = reservation.tableId
    ? tables.find((table) => String(table._id) === String(reservation.tableId))
    : null

  if (reservation.tableId && !selectedTable) {
    return 'Selected table no longer exists'
  }

  if (selectedTable && Number(reservation.guests || 0) > Number(selectedTable.seats || 0)) {
    return `This table only has ${selectedTable.seats} seats`
  }

  if (selectedTable) {
    const assignedReservations = await reservations
      .find({
        _id: { $ne: reservation._id },
        type: 'table',
        status: 'approved',
        date: reservation.date,
        tableId: String(reservation.tableId),
      })
      .toArray()
    const requestedStart = timeToMinutes(reservation.time)
    const assignedConflict = assignedReservations.some((assignedReservation) => slotsOverlap(requestedStart, timeToMinutes(assignedReservation.time)))

    if (assignedConflict) {
      return `${selectedTable.name} is already assigned to another approved reservation at this time`
    }

    return ''
  }

  const totalSeats = tables.reduce((sum, table) => sum + Number(table.seats || 0), 0)

  if (!totalSeats) {
    return ''
  }

  const approvedReservations = await reservations
    .find({
      _id: { $ne: reservation._id },
      type: 'table',
      status: 'approved',
      date: reservation.date,
    })
    .toArray()

  const requestedStart = timeToMinutes(reservation.time)
  const requestedGuests = Number(reservation.guests || 0)
  const reservedGuests = approvedReservations.reduce((sum, approvedReservation) => {
    const approvedStart = timeToMinutes(approvedReservation.time)

    if (!slotsOverlap(requestedStart, approvedStart)) {
      return sum
    }

    return sum + Number(approvedReservation.guests || 0)
  }, 0)

  if (reservedGuests + requestedGuests > totalSeats) {
    return `Approving this table would exceed restaurant seating capacity for this time (${reservedGuests}/${totalSeats} seats already approved)`
  }

  return ''
}

function timeToMinutes(time) {
  const [hours, minutes] = String(time).split(':').map(Number)
  return hours * 60 + minutes
}

function slotsOverlap(firstStart, secondStart) {
  if (!Number.isFinite(firstStart) || !Number.isFinite(secondStart)) {
    return false
  }

  return firstStart < secondStart + TABLE_SLOT_MINUTES && secondStart < firstStart + TABLE_SLOT_MINUTES
}

function isValidStayRange(checkIn, checkOut) {
  const start = new Date(`${checkIn}T00:00:00`)
  const end = new Date(`${checkOut}T00:00:00`)
  return Number.isFinite(start.getTime()) && Number.isFinite(end.getTime()) && end > start
}
