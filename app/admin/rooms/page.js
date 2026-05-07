'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Rooms() {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Room 1', description: 'Elegant room for events', capacity: 20 },
    { id: 2, name: 'Room 2', description: 'Cozy room for small gatherings', capacity: 10 },
  ])

  const [newRoom, setNewRoom] = useState({ name: '', description: '', capacity: 1 })

  const handleAddRoom = () => {
    setRooms([...rooms, { ...newRoom, id: rooms.length + 1 }])
    setNewRoom({ name: '', description: '', capacity: 1 })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-gray-900">Admin Dashboard</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">Back to Site</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Manage Rooms</h2>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Room</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Room Name" value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} className="block w-full border-gray-300 rounded-md shadow-sm" />
              <input type="text" placeholder="Description" value={newRoom.description} onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })} className="block w-full border-gray-300 rounded-md shadow-sm" />
              <input type="number" placeholder="Capacity" value={newRoom.capacity} onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })} className="block w-full border-gray-300 rounded-md shadow-sm" />
              <button onClick={handleAddRoom} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add Room
              </button>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Existing Rooms</h3>
            <ul className="space-y-2">
              {rooms.map(room => (
                <li key={room.id} className="flex justify-between items-center p-4 border rounded">
                  <div>
                    <h4 className="font-semibold">{room.name}</h4>
                    <p className="text-gray-600">{room.description}</p>
                    <p className="text-sm text-gray-500">Capacity: {room.capacity}</p>
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