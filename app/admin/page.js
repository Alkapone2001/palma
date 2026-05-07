'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarClock, DoorOpen, LayoutDashboard, Table2, UsersRound } from 'lucide-react'

export default function Admin() {
  const [reservations, setReservations] = useState([])
  const [rooms, setRooms] = useState([])
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
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

    loadDashboard()
  }, [])

  const stats = useMemo(() => {
    const roomReservations = reservations.filter((reservation) => reservation.type === 'room')
    const tableReservations = reservations.filter((reservation) => reservation.type === 'table')
    const availableRooms = rooms.filter((room) => room.isAvailable !== false)
    const pendingReservations = reservations.filter((reservation) => (reservation.status || 'pending') === 'pending')

    return [
      { label: 'Reservations', value: reservations.length, icon: CalendarClock },
      { label: 'Pending approval', value: pendingReservations.length, icon: CalendarClock },
      { label: 'Table requests', value: tableReservations.length, icon: Table2 },
      { label: 'Hotel requests', value: roomReservations.length, icon: DoorOpen },
      { label: 'Available rooms', value: availableRooms.length, icon: UsersRound },
    ]
  }, [reservations, rooms])

  const recentReservations = reservations.slice(0, 5)

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-950 text-white">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-stone-950">Palma 5 Admin</h1>
              <p className="text-sm text-stone-500">Reservations, rooms, and tables</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50">
              Back to Site
            </Link>
            <button onClick={handleLogout} className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Dashboard</p>
            <h2 className="mt-3 text-4xl font-semibold text-stone-950">Restaurant control center</h2>
            <p className="mt-4 max-w-2xl leading-7 text-stone-600">
              Check reservation activity, manage rooms and tables, and review what guests are asking for before confirming.
            </p>
          </div>
          <Link href="/admin/reservations" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
            Review reservations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
                  <stat.icon className="h-5 w-5" />
                </div>
                {loading && <span className="h-3 w-3 animate-pulse rounded-full bg-stone-300" />}
              </div>
              <p className="mt-6 text-4xl font-semibold text-stone-950">{loading ? '...' : stat.value}</p>
              <p className="mt-2 text-sm font-medium text-stone-500">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60">
            <h3 className="text-2xl font-semibold text-stone-950">Quick actions</h3>
            <div className="mt-6 space-y-3">
              <AdminAction href="/admin/rooms" icon={DoorOpen} title="Manage hotel rooms" text="Add photos, nightly prices, bed details, and availability." />
              <AdminAction href="/admin/tables" icon={Table2} title="Manage tables" text="Add or remove dining tables and capacities." />
              <AdminAction href="/admin/calendar" icon={CalendarClock} title="Calendar" text="See room occupancy and restaurant reservations by date." />
              <AdminAction href="/admin/reservations" icon={CalendarClock} title="Reservations" text="Approve, assign tables, and update guest requests." />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-semibold text-stone-950">Recent requests</h3>
              <Link href="/admin/reservations" className="text-sm font-semibold text-emerald-900 hover:text-emerald-700">View all</Link>
            </div>
            <div className="mt-6 space-y-3">
              {loading ? (
                <div className="h-28 animate-pulse rounded-2xl bg-stone-100" />
              ) : recentReservations.length === 0 ? (
                <p className="rounded-2xl bg-stone-50 p-5 text-stone-600">No reservations yet.</p>
              ) : (
                recentReservations.map((reservation) => (
                  <div key={reservation._id} className="rounded-2xl border border-stone-100 p-4">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <p className="font-semibold text-stone-950">{reservation.name}</p>
              <p className="mt-1 text-sm text-stone-500">
                          {reservation.type === 'room'
                            ? `${reservation.roomName || 'Hotel room'} - ${reservation.checkIn || 'check-in'} to ${reservation.checkOut || 'check-out'}`
                            : `Table - ${reservation.date} at ${reservation.time}`}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-900">
                        {reservation.status || 'pending'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function AdminAction({ href, icon: Icon, title, text }) {
  return (
    <Link href={href} className="group flex items-center justify-between gap-4 rounded-2xl border border-stone-100 p-4 transition hover:border-emerald-100 hover:bg-emerald-50/50">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-800 group-hover:bg-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-semibold text-stone-950">{title}</h4>
          <p className="mt-1 text-sm text-stone-500">{text}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-emerald-900" />
    </Link>
  )
}
