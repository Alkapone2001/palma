'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Booking() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    type: 'table',
    guests: 1,
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert('Booking submitted successfully!')
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          type: 'table',
          guests: 1,
        })
      } else {
        alert('Failed to submit booking')
      }
    } catch (error) {
      alert('Error submitting booking')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">Palma Restaurant</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
              <Link href="/menu" className="text-gray-700 hover:text-gray-900">Menu</Link>
              <Link href="/booking" className="text-gray-700 hover:text-gray-900">Book Now</Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Book a Table or Room</h2>
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                <option value="table">Table</option>
                <option value="room">Room</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
              <input type="number" name="guests" value={formData.guests} onChange={handleChange} min="1" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Submit Booking
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}