import { ObjectId } from 'mongodb'
import { isAdminRequest, unauthorized } from '../../lib/adminAuth'
import { createMongoClient, getRestaurantDb } from '../../lib/mongodb'

export const dynamic = 'force-dynamic'

const editableRoomFields = [
  'roomNumber',
  'name',
  'description',
  'capacity',
  'imageUrl',
  'galleryImages',
  'category',
  'size',
  'bedType',
  'price',
  'priceUnit',
  'priceNote',
  'priceLabel',
  'details',
  'isAvailable',
]

export async function GET() {
  const client = createMongoClient()

  try {
    await client.connect()
    const database = getRestaurantDb(client)
    const rooms = database.collection('rooms')
    const result = await rooms.find({}).sort({ createdAt: -1, name: 1 }).toArray()
    return Response.json(result)
  } catch (error) {
    console.error(error)
    return roomApiError(error, 'Failed to fetch rooms')
  } finally {
    await client.close()
  }
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const client = createMongoClient()

  try {
    const body = await request.json()
    const room = {
      ...normalizeRoomData(body),
      createdAt: body.createdAt || new Date().toISOString(),
    }

    await client.connect()
    const database = getRestaurantDb(client)
    const rooms = database.collection('rooms')
    const result = await rooms.insertOne(room)
    return Response.json({ message: 'Room created', id: result.insertedId })
  } catch (error) {
    console.error(error)
    return roomApiError(error, 'Failed to create room')
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
    const { id } = body

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: 'A valid room id is required' }, { status: 400 })
    }

    const updateData = normalizeRoomData(body, { partial: true })

    await client.connect()
    const database = getRestaurantDb(client)
    const rooms = database.collection('rooms')
    const result = await rooms.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Room not found' }, { status: 404 })
    }

    return Response.json({ message: 'Room updated' })
  } catch (error) {
    console.error(error)
    return roomApiError(error, 'Failed to update room')
  } finally {
    await client.close()
  }
}

export async function DELETE(request) {
  if (!isAdminRequest(request)) {
    return unauthorized()
  }

  const client = createMongoClient()
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  try {
    if (!ObjectId.isValid(id)) {
      return Response.json({ error: 'A valid room id is required' }, { status: 400 })
    }

    await client.connect()
    const database = getRestaurantDb(client)
    const rooms = database.collection('rooms')
    const result = await rooms.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Room not found' }, { status: 404 })
    }

    return Response.json({ message: 'Room deleted' })
  } catch (error) {
    console.error(error)
    return roomApiError(error, 'Failed to delete room')
  } finally {
    await client.close()
  }
}

function roomApiError(error, fallback) {
  const message = process.env.NODE_ENV === 'production'
    ? fallback
    : `${fallback}: ${error.message}`

  return Response.json({ error: message }, { status: 500 })
}

function normalizeRoomData(body, { partial = false } = {}) {
  const room = {}

  for (const field of editableRoomFields) {
    if (!partial || body[field] !== undefined) {
      room[field] = normalizeRoomField(field, body[field])
    }
  }

  return room
}

function normalizeRoomField(field, value) {
  if (field === 'capacity') {
    return Number(value || 1)
  }

  if (field === 'price') {
    return value ? Number(value) : ''
  }

  if (field === 'galleryImages') {
    return normalizeList(value)
  }

  if (field === 'details') {
    return normalizeList(value)
  }

  if (field === 'isAvailable') {
    return value !== false
  }

  if (field === 'priceUnit') {
    return value || 'per night'
  }

  return value || ''
}

function normalizeList(value) {
  return Array.isArray(value)
    ? value
    : String(value || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
}
