'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/booking')
      const data = await response.json()
      setReservations(data)
    } catch (error) {
      console.error('Failed to fetch reservations:', error)
    } finally {
      setLoading(false)
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Reservations</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">All Reservations</h3>
            <ul className="space-y-2">
              {reservations.map(reservation => (
                <li key={reservation._id} className="p-4 border rounded">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <strong>Name:</strong> {reservation.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {reservation.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {reservation.phone}
                    </div>
                    <div>
                      <strong>Type:</strong> {reservation.type}
                    </div>
                    {reservation.roomName && (
                      <div>
                        <strong>Room:</strong> {reservation.roomName}
                      </div>
                    )}
                    <div>
                      <strong>Date:</strong> {reservation.date}
                    </div>
                    <div>
                      <strong>Time:</strong> {reservation.time}
                    </div>
                    <div>
                      <strong>Guests:</strong> {reservation.guests}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
