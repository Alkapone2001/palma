'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, DoorOpen, Mail, Phone, Plus, RefreshCw, UserRound, UsersRound } from 'lucide-react'

const activeStatuses = ['pending', 'approved']
const blockedStatuses = ['approved']

const emptyStaffBooking = {
  roomId: '',
  checkIn: '',
  checkOut: '',
  name: '',
  email: '',
  phone: '',
  adults: 1,
  children: 0,
  notes: '',
}

export default function AdminCalendar() {
  const [reservations, setReservations] = useState([])
  const [rooms, setRooms] = useState([])
  const [tables, setTables] = useState([])
  const [selectedDate, setSelectedDate] = useState(todayKey())
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(new Date()))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [bookingForm, setBookingForm] = useState(emptyStaffBooking)

  useEffect(() => {
    loadCalendar()
  }, [])

  async function loadCalendar() {
    setLoading(true)

    try {
      const [reservationResponse, roomResponse, tableResponse] = await Promise.all([
        fetch('/api/booking'),
        fetch('/api/rooms'),
        fetch('/api/tables'),
      ])
      const [reservationData, roomData, tableData] = await Promise.all([
        reservationResponse.json(),
        roomResponse.json(),
        tableResponse.json(),
      ])

      setReservations(Array.isArray(reservationData) ? reservationData : [])
      setRooms(Array.isArray(roomData) ? roomData : [])
      setTables(Array.isArray(tableData) ? tableData : [])
    } catch (error) {
      setMessage('Calendar could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  const roomReservations = useMemo(
    () => reservations.filter((reservation) => reservation.type === 'room'),
    [reservations],
  )
  const approvedRoomReservations = useMemo(
    () => roomReservations.filter((reservation) => blockedStatuses.includes(reservation.status || 'pending')),
    [roomReservations],
  )
  const pendingRoomReservations = useMemo(
    () => roomReservations.filter((reservation) => (reservation.status || 'pending') === 'pending'),
    [roomReservations],
  )
  const selectedDayRoomReservations = useMemo(
    () => roomReservations
      .filter((reservation) => activeStatuses.includes(reservation.status || 'pending') && dateTouchesStay(selectedDate, reservation))
      .sort((first, second) => String(first.checkIn || '').localeCompare(String(second.checkIn || ''))),
    [roomReservations, selectedDate],
  )
  const selectedTableReservations = useMemo(
    () => reservations
      .filter((reservation) => reservation.type === 'table' && reservation.date === selectedDate)
      .sort((first, second) => String(first.time || '').localeCompare(String(second.time || ''))),
    [reservations, selectedDate],
  )
  const monthDays = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth])
  const occupancyDays = useMemo(() => buildOccupancyDays(selectedDate, 28), [selectedDate])
  const selectedRoom = rooms.find((room) => String(room._id) === String(bookingForm.roomId))
  const manualNights = calculateNights(bookingForm.checkIn, bookingForm.checkOut)
  const manualGuests = Number(bookingForm.adults || 0) + Number(bookingForm.children || 0)
  const manualConflict = bookingForm.roomId && datesOverlapApprovedStay(bookingForm.roomId, bookingForm.checkIn, bookingForm.checkOut, approvedRoomReservations)
  const canCreateBooking = selectedRoom && manualNights > 0 && manualGuests > 0 && !manualConflict && !saving
  const occupancyRate = rooms.length && occupancyDays.length
    ? Math.round((occupancyDays.reduce((sum, day) => sum + rooms.filter((room) => getRoomStayForDate(room, day.key, approvedRoomReservations)).length, 0) / (rooms.length * occupancyDays.length)) * 100)
    : 0

  function moveMonth(direction) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1))
  }

  function handleBookingChange(event) {
    const { name, value } = event.target
    setBookingForm((current) => ({ ...current, [name]: value }))
  }

  async function createStaffBooking(event) {
    event.preventDefault()

    if (!canCreateBooking) return

    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'room',
          roomId: String(selectedRoom._id),
          roomName: selectedRoom.name,
          name: bookingForm.name,
          email: bookingForm.email,
          phone: bookingForm.phone,
          checkIn: bookingForm.checkIn,
          checkOut: bookingForm.checkOut,
          adults: Number(bookingForm.adults || 0),
          children: Number(bookingForm.children || 0),
          guests: manualGuests,
          nights: manualNights,
          estimatedTotal: selectedRoom.price ? Number(selectedRoom.price) * manualNights : null,
          notes: bookingForm.notes,
          status: 'approved',
          source: 'admin',
          createdAt: new Date().toISOString(),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'Room booking could not be created.')
      }

      setBookingForm(emptyStaffBooking)
      setSelectedDate(bookingForm.checkIn)
      await loadCalendar()
      setMessage('Room booking added and blocked on the calendar.')
    } catch (error) {
      setMessage(error.message || 'Room booking could not be created.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-emerald-900">
            <ArrowLeft className="h-4 w-4" />
            Admin Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/admin/reservations" className="text-sm font-semibold text-stone-700 hover:text-emerald-900">Requests</Link>
            <button type="button" onClick={loadCalendar} className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Room booking dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold">Calendar, occupancy, and staff bookings</h1>
            <p className="mt-4 max-w-3xl leading-7 text-stone-600">
              See every day as a square, spot arrivals and departures, approve requests, and block a room immediately when staff take a direct booking.
            </p>
          </div>
          <label className="block text-sm font-semibold text-stone-800">
            Selected date
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="mt-2 block rounded-xl border border-stone-200 bg-white px-3 py-3 outline-none focus:border-emerald-900"
            />
          </label>
        </div>

        {message && <p className="mt-6 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-stone-700 shadow-sm">{message}</p>}

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <Metric icon={DoorOpen} label="Rooms" value={rooms.length} />
          <Metric icon={CalendarDays} label="Pending room requests" value={pendingRoomReservations.length} />
          <Metric icon={CheckCircle2} label="28-day occupancy" value={`${occupancyRate}%`} />
          <Metric icon={UsersRound} label="Tables today" value={selectedTableReservations.length} />
        </section>

        {loading ? (
          <div className="mt-10 h-72 animate-pulse rounded-[1.5rem] bg-stone-200" />
        ) : (
          <div className="mt-10 grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-8">
              <section className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-2xl font-semibold">Month view</h2>
                    <p className="mt-1 text-sm text-stone-500">Each square is one calendar day. Dark means at least one approved room stay.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => moveMonth(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 hover:bg-stone-50" aria-label="Previous month">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <p className="min-w-36 text-center text-sm font-semibold">{formatMonth(visibleMonth)}</p>
                    <button type="button" onClick={() => moveMonth(1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 hover:bg-stone-50" aria-label="Next month">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-2">
                  {monthDays.map((day) => (
                    <MonthDayButton
                      key={day.key}
                      day={day}
                      selected={selectedDate === day.key}
                      rooms={rooms}
                      reservations={approvedRoomReservations}
                      onSelect={() => setSelectedDate(day.key)}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-2xl font-semibold">Room board</h2>
                    <p className="mt-1 text-sm text-stone-500">A rolling 28-day view from the selected date.</p>
                  </div>
                  <Legend />
                </div>
                <div className="mt-6 overflow-x-auto">
                  <div className="min-w-[1120px]">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `190px repeat(${occupancyDays.length}, minmax(34px, 1fr))` }}>
                      <div />
                      {occupancyDays.map((day) => (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => setSelectedDate(day.key)}
                          className={`rounded-lg px-1 py-2 text-center text-xs font-semibold ${selectedDate === day.key ? 'bg-emerald-900 text-white' : day.isWeekend ? 'bg-stone-100 text-stone-700' : 'bg-stone-50 text-stone-600'}`}
                        >
                          <span className="block">{day.weekday}</span>
                          <span className="block">{day.day}</span>
                        </button>
                      ))}
                      {rooms.map((room) => (
                        <RoomRow key={room._id} room={room} days={occupancyDays} reservations={roomReservations} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-8">
              <StaffBookingForm
                rooms={rooms}
                form={bookingForm}
                selectedRoom={selectedRoom}
                nights={manualNights}
                guests={manualGuests}
                conflict={manualConflict}
                saving={saving}
                canSubmit={canCreateBooking}
                onChange={handleBookingChange}
                onSubmit={createStaffBooking}
              />

              <DayPanel
                selectedDate={selectedDate}
                roomReservations={selectedDayRoomReservations}
                tableReservations={selectedTableReservations}
              />
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

function MonthDayButton({ day, selected, rooms, reservations, onSelect }) {
  const occupiedRooms = day.inMonth
    ? rooms.filter((room) => getRoomStayForDate(room, day.key, reservations)).length
    : 0
  const isFull = rooms.length > 0 && occupiedRooms >= rooms.length

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`aspect-square rounded-xl border p-2 text-left transition ${selected ? 'border-emerald-900 ring-4 ring-emerald-900/10' : 'border-stone-100 hover:border-emerald-200'} ${day.inMonth ? 'bg-white' : 'bg-stone-50 text-stone-300'} ${occupiedRooms ? 'shadow-sm' : ''}`}
    >
      <span className="text-sm font-semibold">{day.date.getDate()}</span>
      {day.inMonth && (
        <span className={`mt-3 block rounded-lg px-2 py-1 text-center text-xs font-semibold ${isFull ? 'bg-red-100 text-red-800' : occupiedRooms ? 'bg-emerald-900 text-white' : 'bg-stone-100 text-stone-500'}`}>
          {occupiedRooms ? `${occupiedRooms}/${rooms.length}` : 'Free'}
        </span>
      )}
    </button>
  )
}

function RoomRow({ room, days, reservations }) {
  return (
    <>
      <div className="sticky left-0 z-10 flex items-center rounded-lg bg-white px-3 py-3 text-sm font-semibold shadow-sm">
        <span className="truncate">{room.name}</span>
      </div>
      {days.map((day) => {
        const booking = getRoomStayForDate(room, day.key, reservations)
        const status = booking?.status || ''
        const isArrival = booking?.checkIn === day.key
        const isDeparture = booking?.checkOut === day.key

        return (
          <div
            key={`${room._id}-${day.key}`}
            title={booking ? `${booking.name}: ${booking.checkIn} to ${booking.checkOut}` : 'Available'}
            className={`min-h-12 rounded-lg border p-1 ${getOccupancyClass(status, day.isWeekend)}`}
          >
            {booking && (
              <span className="block truncate py-3 text-center text-[10px] font-semibold">
                {isArrival ? 'In ' : isDeparture ? 'Out ' : ''}
                {booking.name}
              </span>
            )}
          </div>
        )
      })}
    </>
  )
}

function StaffBookingForm({ rooms, form, selectedRoom, nights, guests, conflict, saving, canSubmit, onChange, onSubmit }) {
  const totalEstimate = selectedRoom?.price && nights > 0 ? Number(selectedRoom.price) * nights : null

  return (
    <section className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
          <Plus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Book a room</h2>
          <p className="text-sm text-stone-500">Creates an approved stay immediately.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-stone-800">
          Room
          <select name="roomId" value={form.roomId} onChange={onChange} required className="mt-2 block w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-900">
            <option value="">Choose room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>{room.name} - up to {room.capacity} guests</option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field icon={CalendarDays} label="Check-in">
            <input type="date" name="checkIn" value={form.checkIn} onChange={onChange} required className="field-input" />
          </Field>
          <Field icon={CalendarDays} label="Check-out">
            <input type="date" name="checkOut" value={form.checkOut} onChange={onChange} min={form.checkIn || undefined} required className="field-input" />
          </Field>
          <Field icon={UsersRound} label="Adults">
            <input type="number" name="adults" value={form.adults} onChange={onChange} min="1" required className="field-input" />
          </Field>
          <Field icon={UsersRound} label="Children">
            <input type="number" name="children" value={form.children} onChange={onChange} min="0" className="field-input" />
          </Field>
          <Field icon={UserRound} label="Guest name">
            <input name="name" value={form.name} onChange={onChange} required className="field-input" placeholder="Guest name" />
          </Field>
          <Field icon={Mail} label="Email">
            <input type="email" name="email" value={form.email} onChange={onChange} required className="field-input" placeholder="guest@example.com" />
          </Field>
          <Field icon={Phone} label="Phone">
            <input type="tel" name="phone" value={form.phone} onChange={onChange} required className="field-input" placeholder="+385 ..." />
          </Field>
        </div>
        <label className="block text-sm font-semibold text-stone-800">
          Staff notes
          <textarea name="notes" value={form.notes} onChange={onChange} rows="3" className="mt-2 block w-full resize-none rounded-xl border border-stone-200 px-3 py-3 text-sm outline-none focus:border-emerald-900" placeholder="Deposit, source, arrival time, breakfast, or special details." />
        </label>

        <div className="rounded-2xl bg-stone-50 p-4">
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <Summary label="Nights" value={nights > 0 ? nights : 'Choose dates'} />
            <Summary label="Guests" value={guests || 'Add guests'} />
            <Summary label="Estimate" value={totalEstimate ? `EUR ${totalEstimate.toLocaleString()}` : 'No price'} />
          </div>
          {conflict && <p className="mt-3 text-sm font-semibold text-red-700">This room already has an approved booking during these dates.</p>}
          {selectedRoom && guests > Number(selectedRoom.capacity || 99) && <p className="mt-3 text-sm font-semibold text-amber-700">Guest count is above this room capacity.</p>}
        </div>

        <button type="submit" disabled={!canSubmit} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
          <CheckCircle2 className="h-4 w-4" />
          {saving ? 'Adding booking...' : 'Add approved booking'}
        </button>
      </form>
    </section>
  )
}

function DayPanel({ selectedDate, roomReservations, tableReservations }) {
  return (
    <section className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60">
      <h2 className="text-2xl font-semibold">{formatLongDate(selectedDate)}</h2>
      <div className="mt-5 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Rooms</p>
          <div className="mt-3 space-y-3">
            {roomReservations.length === 0 ? (
              <p className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">No room arrivals, departures, or stays.</p>
            ) : (
              roomReservations.map((reservation) => <ReservationLine key={reservation._id} reservation={reservation} />)
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Restaurant</p>
          <div className="mt-3 space-y-3">
            {tableReservations.length === 0 ? (
              <p className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">No table reservations for this date.</p>
            ) : (
              tableReservations.map((reservation) => (
                <div key={reservation._id} className="rounded-2xl bg-stone-50 p-4 text-sm">
                  <p className="font-semibold text-stone-950">{reservation.time} - {reservation.name}</p>
                  <p className="mt-1 text-stone-500">{reservation.guests} guests / {reservation.tableName || 'No table assigned'} / {reservation.status || 'pending'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ReservationLine({ reservation }) {
  return (
    <div className="rounded-2xl bg-stone-50 p-4 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-stone-950">{reservation.roomName || 'Room'} - {reservation.name}</p>
          <p className="mt-1 text-stone-500">{reservation.checkIn} to {reservation.checkOut}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${reservation.status === 'approved' ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-900'}`}>
          {reservation.status || 'pending'}
        </span>
      </div>
    </div>
  )
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60">
      <Icon className="h-5 w-5 text-emerald-900" />
      <p className="mt-5 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-stone-500">{label}</p>
    </div>
  )
}

function Field({ icon: Icon, label, children }) {
  return (
    <label>
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-800">
        <Icon className="h-4 w-4 text-emerald-800" />
        {label}
      </span>
      {children}
    </label>
  )
}

function Summary({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-1 font-semibold text-stone-950">{value}</p>
    </div>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-2 text-xs font-semibold">
      <span className="rounded-full bg-emerald-900 px-3 py-1.5 text-white">Approved</span>
      <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-900">Pending</span>
      <span className="rounded-full bg-stone-100 px-3 py-1.5 text-stone-600">Free</span>
    </div>
  )
}

function getOccupancyClass(status, isWeekend) {
  if (status === 'approved') return 'border-emerald-800 bg-emerald-900 text-white'
  if (status === 'pending') return 'border-amber-200 bg-amber-100 text-amber-950'
  return isWeekend ? 'border-stone-100 bg-stone-100' : 'border-stone-100 bg-stone-50'
}

function getRoomStayForDate(room, date, reservations) {
  return reservations.find((reservation) => (
    String(reservation.roomId) === String(room._id)
    && activeStatuses.includes(reservation.status || 'pending')
    && date >= reservation.checkIn
    && date < reservation.checkOut
  ))
}

function datesOverlapApprovedStay(roomId, checkIn, checkOut, reservations) {
  if (!roomId || !checkIn || !checkOut || calculateNights(checkIn, checkOut) <= 0) return false
  return reservations.some((reservation) => (
    String(reservation.roomId) === String(roomId)
    && checkIn < reservation.checkOut
    && checkOut > reservation.checkIn
  ))
}

function dateTouchesStay(date, reservation) {
  return date >= reservation.checkIn && date <= reservation.checkOut
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const start = new Date(`${checkIn}T00:00:00`)
  const end = new Date(`${checkOut}T00:00:00`)
  const diff = end.getTime() - start.getTime()
  return diff > 0 ? Math.round(diff / 86400000) : 0
}

function buildOccupancyDays(startKey, count) {
  const start = parseDateKey(startKey)
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return dayMeta(date, true)
  })
}

function buildMonthDays(monthDate) {
  const first = startOfMonth(monthDate)
  const start = new Date(first)
  const mondayOffset = (first.getDay() + 6) % 7
  start.setDate(first.getDate() - mondayOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return dayMeta(date, date.getMonth() === first.getMonth())
  })
}

function dayMeta(date, inMonth) {
  const key = toDateKey(date)
  return {
    key,
    date,
    day: date.getDate(),
    weekday: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date),
    isWeekend: [0, 6].includes(date.getDay()),
    inMonth,
  }
}

function todayKey() {
  return toDateKey(new Date())
}

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateKey(key) {
  const [year, month, day] = String(key).split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function formatMonth(date) {
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date)
}

function formatLongDate(key) {
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(parseDateKey(key))
}
