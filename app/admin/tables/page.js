'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Tables() {
  const [tables, setTables] = useState([
    { id: 1, name: 'Table 1', seats: 4 },
    { id: 2, name: 'Table 2', seats: 6 },
  ])

  const [newTable, setNewTable] = useState({ name: '', seats: 2 })

  const handleAddTable = () => {
    setTables([...tables, { ...newTable, id: tables.length + 1 }])
    setNewTable({ name: '', seats: 2 })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-900">Admin Dashboard</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900">Back to Site</Link>
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
                <li key={table.id} className="flex justify-between items-center p-4 border rounded">
                  <div>
                    <h4 className="font-semibold">{table.name}</h4>
                    <p className="text-sm text-gray-500">Seats: {table.seats}</p>
                  </div>
                  <button className="text-red-500 hover:text-red-700">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}