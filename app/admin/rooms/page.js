'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [newRoom, setNewRoom] = useState({ name: '', description: '', capacity: 1 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms')
      const data = await response.json()
      setRooms(data)
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddRoom = async () => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
      })
      if (response.ok) {
        setNewRoom({ name: '', description: '', capacity: 1 })
        fetchRooms()
      }
    } catch (error) {
      console.error('Failed to add room:', error)
    }
  }

  const handleDeleteRoom = async (id) => {
    try {
      const response = await fetch(`/api/rooms?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchRooms()
      }
    } catch (error) {
      console.error('Failed to delete room:', error)
    }
  }

  if (loading) return <div>Loading...</div>

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
              <input type="text" placeholder="Room Name" value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} className="block w-full border-gray-300 rounded-md shadow-sm p-2" />
              <input type="text" placeholder="Description" value={newRoom.description} onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })} className="block w-full border-gray-300 rounded-md shadow-sm p-2" />
              <input type="number" placeholder="Capacity" value={newRoom.capacity} onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })} className="block w-full border-gray-300 rounded-md shadow-sm p-2" />
              <button onClick={handleAddRoom} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add Room
              </button>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Existing Rooms</h3>
            <ul className="space-y-2">
              {rooms.map(room => (
                <li key={room._id} className="flex justify-between items-center p-4 border rounded">
                  <div>
                    <h4 className="font-semibold">{room.name}</h4>
                    <p className="text-gray-600">{room.description}</p>
                    <p className="text-sm text-gray-500">Capacity: {room.capacity}</p>
                  </div>
                  <button onClick={() => handleDeleteRoom(room._id)} className="text-red-500 hover:text-red-700">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}