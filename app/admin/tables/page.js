'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Table2, Trash2, UsersRound } from 'lucide-react'

export default function Tables() {
  const [tables, setTables] = useState([])
  const [newTable, setNewTable] = useState({ name: '', seats: 2 })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchTables()
  }, [])

  const totalSeats = useMemo(
    () => tables.reduce((sum, table) => sum + Number(table.seats || 0), 0),
    [tables],
  )

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/tables')
      const data = await response.json()
      setTables(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch tables:', error)
      setMessage('Could not load tables.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTable = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!newTable.name.trim() || Number(newTable.seats) < 1) {
      setMessage('Add a table name and at least one seat.')
      return
    }

    try {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTable.name.trim(),
          seats: Number(newTable.seats),
          createdAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add table')
      }

      setNewTable({ name: '', seats: 2 })
      setMessage('Table added.')
      fetchTables()
    } catch (error) {
      console.error('Failed to add table:', error)
      setMessage('Could not add this table.')
    }
  }

  const handleDeleteTable = async (id) => {
    setMessage('')

    try {
      const response = await fetch(`/api/tables?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete table')
      }

      setMessage('Table deleted.')
      fetchTables()
    } catch (error) {
      console.error('Failed to delete table:', error)
      setMessage('Could not delete this table.')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f3ee] px-6 py-10 text-[#2f261f]">
        <p>Loading tables...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f3ee] text-[#2f261f]">
      <section className="border-b border-[#e1d6ca] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8a5a2d]">
              <ArrowLeft className="h-4 w-4" />
              Admin dashboard
            </Link>
            <h1 className="mt-3 text-3xl font-bold">Restaurant tables</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#69594d]">
              These seats power the approval logic for restaurant reservations. A reservation uses a two-hour dining slot.
            </p>
          </div>
          <Link
            href="/"
            className="hidden rounded-full border border-[#d8c8b8] px-4 py-2 text-sm font-semibold text-[#3d3027] hover:bg-[#fbf8f4] sm:inline-flex"
          >
            Back to site
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <aside className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-[#e1d6ca] bg-white p-4">
              <Table2 className="mb-3 h-5 w-5 text-[#8a5a2d]" />
              <p className="text-2xl font-bold">{tables.length}</p>
              <p className="text-sm text-[#69594d]">Tables</p>
            </div>
            <div className="rounded-lg border border-[#e1d6ca] bg-white p-4">
              <UsersRound className="mb-3 h-5 w-5 text-[#8a5a2d]" />
              <p className="text-2xl font-bold">{totalSeats}</p>
              <p className="text-sm text-[#69594d]">Total seats</p>
            </div>
          </div>

          <form onSubmit={handleAddTable} className="rounded-lg border border-[#e1d6ca] bg-white p-5">
            <h2 className="text-lg font-bold">Add table</h2>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-[#3d3027]">
                Table name
                <input
                  type="text"
                  value={newTable.name}
                  onChange={(event) => setNewTable({ ...newTable, name: event.target.value })}
                  placeholder="Terrace 01"
                  className="mt-2 block w-full rounded-lg border border-[#d8c8b8] px-3 py-2 text-sm outline-none focus:border-[#8a5a2d]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#3d3027]">
                Seats
                <input
                  type="number"
                  min="1"
                  value={newTable.seats}
                  onChange={(event) => setNewTable({ ...newTable, seats: event.target.value })}
                  className="mt-2 block w-full rounded-lg border border-[#d8c8b8] px-3 py-2 text-sm outline-none focus:border-[#8a5a2d]"
                />
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f261f] px-4 py-3 text-sm font-bold text-white hover:bg-[#4a382c]"
              >
                <Plus className="h-4 w-4" />
                Add table
              </button>
              {message && <p className="text-sm font-semibold text-[#8a5a2d]">{message}</p>}
            </div>
          </form>
        </aside>

        <div className="rounded-lg border border-[#e1d6ca] bg-white">
          <div className="border-b border-[#e1d6ca] px-5 py-4">
            <h2 className="text-lg font-bold">Current floor capacity</h2>
            <p className="mt-1 text-sm text-[#69594d]">
              Approving a table request checks these seats against already approved guests for the same time window.
            </p>
          </div>

          <div className="divide-y divide-[#eee5dc]">
            {tables.length === 0 ? (
              <div className="p-6 text-sm text-[#69594d]">
                Add tables to activate automatic seating capacity checks.
              </div>
            ) : (
              tables.map((table) => (
                <div key={table._id} className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{table.name}</p>
                    <p className="mt-1 text-sm text-[#69594d]">{table.seats} seats</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTable(table._id)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#efc4b8] px-3 py-2 text-sm font-bold text-[#a33b24] hover:bg-[#fff6f3]"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
