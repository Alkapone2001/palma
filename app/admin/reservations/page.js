'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, CheckCircle2, DoorOpen, Mail, Pencil, Phone, Table2, UsersRound, XCircle } from 'lucide-react'

const STATUSES = ['pending', 'approved', 'declined', 'cancelled', 'completed', 'no-show']

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [reservationResponse, tableResponse] = await Promise.all([
        fetch('/api/booking'),
        fetch('/api/tables'),
      ])
      const [reservationData, tableData] = await Promise.all([
        reservationResponse.json(),
        tableResponse.json(),
      ])
      setReservations(Array.isArray(reservationData) ? reservationData : [])
      setTables(Array.isArray(tableData) ? tableData : [])
    } finally {
      setLoading(false)
    }
  }

  const filteredReservations = useMemo(() => {
    if (filter === 'all') return reservations
    if (STATUSES.includes(filter)) return reservations.filter((reservation) => (reservation.status || 'pending') === filter)
    return reservations.filter((reservation) => reservation.type === filter)
  }, [filter, reservations])

  const updateReservation = async (reservation, updateData, successMessage = 'Reservation updated.') => {
    setMessage('')
    const response = await fetch('/api/booking', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: reservation._id, ...updateData }),
    })

    if (response.ok) {
      await fetchData()
      setMessage(successMessage)
    } else {
      const data = await response.json().catch(() => ({}))
      setMessage(data.error || 'Reservation could not be updated.')
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-emerald-900">
            <ArrowLeft className="h-4 w-4" />
            Admin Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin/calendar" className="text-sm font-semibold text-stone-700 hover:text-emerald-900">Room Calendar</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Reservations</p>
            <h1 className="mt-3 text-4xl font-semibold text-stone-950">Guest requests</h1>
            <p className="mt-4 max-w-2xl leading-7 text-stone-600">
              Approve stays, assign restaurant tables, track cancellations, and keep private notes for the team.
            </p>
            {message && <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-stone-700 shadow-sm">{message}</p>}
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto rounded-full border border-stone-200 bg-white p-1">
            {['all', 'table', 'room', 'pending', 'approved', 'cancelled'].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${filter === item ? 'bg-emerald-900 text-white' : 'text-stone-600 hover:bg-stone-50'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-10 space-y-5">
          {loading ? (
            <div className="h-40 animate-pulse rounded-[1.5rem] bg-stone-200" />
          ) : filteredReservations.length === 0 ? (
            <div className="rounded-[1.5rem] border border-stone-200 bg-white p-8 text-stone-600">No reservations found.</div>
          ) : (
            filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation._id}
                reservation={reservation}
                tables={tables}
                onUpdate={(updateData, successMessage) => updateReservation(reservation, updateData, successMessage)}
              />
            ))
          )}
        </section>
      </main>
    </div>
  )
}

function ReservationCard({ reservation, tables, onUpdate }) {
  const isRoom = reservation.type === 'room'
  const status = reservation.status || 'pending'
  const [tableId, setTableId] = useState(reservation.tableId || '')
  const [adminNotes, setAdminNotes] = useState(reservation.adminNotes || '')
  const selectedTable = tables.find((table) => String(table._id) === String(tableId))

  const approveReservation = () => {
    const tableData = !isRoom && selectedTable
      ? {
          tableId: String(selectedTable._id),
          tableName: selectedTable.name,
          tableSeats: Number(selectedTable.seats || 0),
        }
      : {}

    onUpdate({ ...tableData, status: 'approved' }, 'Reservation approved.')
  }

  return (
    <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
              {isRoom ? <DoorOpen className="h-5 w-5" /> : <Table2 className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-stone-950">{reservation.name}</h2>
              <p className="text-sm font-medium capitalize text-stone-500">{isRoom ? reservation.roomName || 'Hotel room' : reservation.tableName || 'Table booking'}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm text-stone-700 sm:grid-cols-2 lg:grid-cols-4">
            <Info icon={Mail}>{reservation.email}</Info>
            <Info icon={Phone}>{reservation.phone}</Info>
            <Info icon={CalendarDays}>{isRoom ? `${reservation.checkIn || 'No check-in'} to ${reservation.checkOut || 'No check-out'}` : `${reservation.date} at ${reservation.time}`}</Info>
            <Info icon={UsersRound}>{reservation.guests} guests</Info>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-stone-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">{reservation.type}</span>
          <span className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${getStatusClass(status)}`}>{status}</span>
        </div>
      </div>

      {isRoom ? (
        <div className="mt-6 grid gap-4 rounded-2xl bg-stone-50 p-5 md:grid-cols-4">
          <Detail label="Check-in" value={reservation.checkIn} />
          <Detail label="Check-out" value={reservation.checkOut} />
          <Detail label="Adults" value={reservation.adults} />
          <Detail label="Children" value={reservation.children} />
          <Detail label="Nights" value={reservation.nights} />
          <Detail label="Estimated total" value={reservation.estimatedTotal ? `EUR ${Number(reservation.estimatedTotal).toLocaleString()}` : ''} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 rounded-2xl bg-stone-50 p-5 md:grid-cols-[1fr_auto] md:items-end">
          <label className="block text-sm font-semibold text-stone-800">
            Assigned table
            <select
              value={tableId}
              onChange={(event) => setTableId(event.target.value)}
              className="mt-2 block w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-900"
            >
              <option value="">No exact table selected</option>
              {tables.map((table) => (
                <option key={table._id} value={table._id}>
                  {table.name} - {table.seats} seats
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => selectedTable && onUpdate({
              tableId: String(selectedTable._id),
              tableName: selectedTable.name,
              tableSeats: Number(selectedTable.seats || 0),
            }, 'Table assignment saved.')}
            disabled={!selectedTable}
            className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save table
          </button>
        </div>
      )}

      {reservation.occasion && !isRoom && (
        <div className="mt-6 rounded-2xl bg-stone-50 p-5">
          <Detail label="Occasion" value={reservation.occasion} />
        </div>
      )}

      {reservation.notes && (
        <div className="mt-4 rounded-2xl border border-stone-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{isRoom ? 'Guest requests' : 'Guest notes'}</p>
          <p className="mt-2 leading-7 text-stone-700">{reservation.notes}</p>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-stone-100 p-5">
        <label className="block text-sm font-semibold text-stone-800">
          Private admin notes
          <textarea
            value={adminNotes}
            onChange={(event) => setAdminNotes(event.target.value)}
            rows="3"
            className="mt-2 block w-full resize-none rounded-xl border border-stone-200 px-3 py-3 text-sm outline-none focus:border-emerald-900"
            placeholder="Internal note for staff, visible only in admin."
          />
        </label>
        <button
          onClick={() => onUpdate({ adminNotes }, 'Admin notes saved.')}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          <Pencil className="h-4 w-4" />
          Save notes
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={approveReservation} disabled={status === 'approved'} className="inline-flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
          <CheckCircle2 className="h-4 w-4" />
          Approve
        </button>
        <button onClick={() => onUpdate({ status: 'declined' }, 'Reservation declined.')} disabled={status === 'declined'} className="inline-flex items-center gap-2 rounded-full border border-red-100 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
          <XCircle className="h-4 w-4" />
          Decline
        </button>
        {['cancelled', 'completed', 'no-show'].map((nextStatus) => (
          <button
            key={nextStatus}
            onClick={() => onUpdate({ status: nextStatus }, `Reservation marked ${nextStatus}.`)}
            disabled={status === nextStatus}
            className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-semibold capitalize text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {nextStatus}
          </button>
        ))}
      </div>
    </article>
  )
}

function Info({ icon: Icon, children }) {
  return (
    <p className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-emerald-800" />
      <span>{children || 'Not provided'}</span>
    </p>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-2 font-semibold text-stone-950">{value || 'Not provided'}</p>
    </div>
  )
}

function getStatusClass(status) {
  if (status === 'approved') return 'bg-emerald-100 text-emerald-950'
  if (status === 'declined' || status === 'cancelled' || status === 'no-show') return 'bg-red-100 text-red-800'
  if (status === 'completed') return 'bg-stone-200 text-stone-800'
  return 'bg-amber-100 text-amber-900'
}
