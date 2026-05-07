'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, DoorOpen, Table2, UsersRound } from 'lucide-react'

const DAY_COUNT = 21

export default function AdminCalendar() {
  const [reservations, setReservations] = useState([])
  const [rooms, setRooms] = useState([])
  const [tables, setTables] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCalendar() {
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
      } finally {
        setLoading(false)
      }
    }

    loadCalendar()
  }, [])

  const days = useMemo(() => buildDays(DAY_COUNT), [])
  const approvedRoomReservations = reservations.filter((reservation) => reservation.type === 'room' && reservation.status === 'approved')
  const selectedTableReservations = reservations
    .filter((reservation) => reservation.type === 'table' && reservation.date === selectedDate)
    .sort((first, second) => String(first.time || '').localeCompare(String(second.time || '')))
  const selectedRoomArrivals = reservations
    .filter((reservation) => reservation.type === 'room' && (reservation.checkIn === selectedDate || reservation.checkOut === selectedDate))
    .sort((first, second) => String(first.checkIn || '').localeCompare(String(second.checkIn || '')))
  const totalSeats = tables.reduce((sum, table) => sum + Number(table.seats || 0), 0)
  const approvedGuestsToday = selectedTableReservations
    .filter((reservation) => reservation.status === 'approved')
    .reduce((sum, reservation) => sum + Number(reservation.guests || 0), 0)

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-emerald-900">
            <ArrowLeft className="h-4 w-4" />
            Admin Dashboard
          </Link>
          <Link href="/admin/reservations" className="text-sm font-semibold text-stone-700 hover:text-emerald-900">Reservations</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Calendar</p>
            <h1 className="mt-3 text-4xl font-semibold">Rooms and restaurant planning</h1>
            <p className="mt-4 max-w-2xl leading-7 text-stone-600">
              Approved room stays block nights. Table reservations show by day with status and assigned table.
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

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <Metric icon={DoorOpen} label="Rooms" value={rooms.length} />
          <Metric icon={Table2} label="Tables" value={tables.length} />
          <Metric icon={UsersRound} label="Approved seats today" value={`${approvedGuestsToday}/${totalSeats || 0}`} />
        </section>

        {loading ? (
          <div className="mt-10 h-52 animate-pulse rounded-[1.5rem] bg-stone-200" />
        ) : (
          <div className="mt-10 grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
            <section className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-emerald-900" />
                <h2 className="text-2xl font-semibold">Room occupancy</h2>
              </div>
              <div className="mt-6 overflow-x-auto">
                <div className="min-w-[920px]">
                  <div className="grid gap-1" style={{ gridTemplateColumns: `180px repeat(${days.length}, minmax(34px, 1fr))` }}>
                    <div />
                    {days.map((day) => (
                      <button
                        key={day.key}
                        onClick={() => setSelectedDate(day.key)}
                        className={`rounded-lg px-1 py-2 text-center text-xs font-semibold ${selectedDate === day.key ? 'bg-emerald-900 text-white' : 'bg-stone-50 text-stone-600'}`}
                      >
                        <span className="block">{day.weekday}</span>
                        <span className="block">{day.day}</span>
                      </button>
                    ))}
                    {rooms.map((room) => (
                      <RoomRow key={room._id} room={room} days={days} reservations={approvedRoomReservations} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <Panel title={`Restaurant - ${selectedDate}`}>
                {selectedTableReservations.length === 0 ? (
                  <p className="text-sm text-stone-600">No table reservations for this date.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedTableReservations.map((reservation) => (
                      <ReservationLine key={reservation._id} icon={Table2} reservation={reservation}>
                        {reservation.time} - {reservation.name}, {reservation.guests} guests
                        <span className="block text-xs text-stone-500">{reservation.tableName || 'No table assigned'} / {reservation.status || 'pending'}</span>
                      </ReservationLine>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title={`Room movement - ${selectedDate}`}>
                {selectedRoomArrivals.length === 0 ? (
                  <p className="text-sm text-stone-600">No arrivals or departures for this date.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedRoomArrivals.map((reservation) => (
                      <ReservationLine key={reservation._id} icon={DoorOpen} reservation={reservation}>
                        {reservation.roomName} - {reservation.name}
                        <span className="block text-xs text-stone-500">
                          {reservation.checkIn === selectedDate ? 'Check-in' : 'Check-out'} / {reservation.status || 'pending'}
                        </span>
                      </ReservationLine>
                    ))}
                  </div>
                )}
              </Panel>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}

function RoomRow({ room, days, reservations }) {
  return (
    <>
      <div className="sticky left-0 z-10 flex items-center rounded-lg bg-white px-3 py-3 text-sm font-semibold shadow-sm">
        {room.name}
      </div>
      {days.map((day) => {
        const booking = reservations.find((reservation) => String(reservation.roomId) === String(room._id) && day.key >= reservation.checkIn && day.key < reservation.checkOut)
        return (
          <div
            key={`${room._id}-${day.key}`}
            title={booking ? `${booking.name}: ${booking.checkIn} to ${booking.checkOut}` : 'Available'}
            className={`min-h-12 rounded-lg border ${booking ? 'border-emerald-800 bg-emerald-900 text-white' : 'border-stone-100 bg-stone-50'}`}
          >
            {booking && <span className="block truncate px-1 py-4 text-center text-[10px] font-semibold">{booking.name}</span>}
          </div>
        )
      })}
    </>
  )
}

function Panel({ title, children }) {
  return (
    <section className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
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

function ReservationLine({ icon: Icon, children }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-stone-50 p-4 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-900" />
      <p className="font-semibold text-stone-800">{children}</p>
    </div>
  )
}

function buildDays(count) {
  const formatter = new Intl.DateTimeFormat('en', { weekday: 'short' })
  return Array.from({ length: count }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    const key = date.toISOString().slice(0, 10)
    return {
      key,
      weekday: formatter.format(date),
      day: date.getDate(),
    }
  })
}
