'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Tables() {
  const [tables, setTables] = useState([])
  const [newTable, setNewTable] = useState({ name: '', seats: 2 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/tables')
      const data = await response.json()
      setTables(data)
    } catch (error) {
      console.error('Failed to fetch tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTable = async () => {
    try {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTable),
      })
      if (response.ok) {
        setNewTable({ name: '', seats: 2 })
        fetchTables()
      }
    } catch (error) {
      console.error('Failed to add table:', error)
    }
  }

  const handleDeleteTable = async (id) => {
    try {
      const response = await fetch(`/api/tables?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchTables()
      }
    } catch (error) {
      console.error('Failed to delete table:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-900">Admin Dashboard</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">Back to Site</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Manage Tables</h2>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Table</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Table Name" value={newTable.name} onChange={(e) => setNewTable({ ...newTable, name: e.target.value })} className="block w-full border-gray-300 rounded-md shadow-sm" />
              <input type="number" placeholder="Seats" value={newTable.seats} onChange={(e) => setNewTable({ ...newTable, seats: parseInt(e.target.value) })} className="block w-full border-gray-300 rounded-md shadow-sm" />
              <button onClick={handleAddTable} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add Table
              </button>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Existing Tables</h3>
            <ul className="space-y-2">
              {tables.map(table => (
                <li key={table._id} className="flex justify-between items-center p-4 border rounded">
                  <div>
                    <h4 className="font-semibold">{table.name}</h4>
                    <p className="text-sm text-gray-500">Seats: {table.seats}</p>
                  </div>
                  <button onClick={() => handleDeleteTable(table._id)} className="text-red-500 hover:text-red-700">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}