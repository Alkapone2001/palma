'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ImageOff, Plus, Trash2, UsersRound } from 'lucide-react'

const emptyRoom = {
  name: '',
  description: '',
  capacity: 8,
  imageUrl: '',
  galleryImages: '',
  category: '',
  size: '',
  bedType: '',
  price: '',
  priceUnit: 'per night',
  priceNote: '',
  priceLabel: '',
  details: '',
  isAvailable: true,
}

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [newRoom, setNewRoom] = useState(emptyRoom)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms')
      const data = await response.json()
      setRooms(Array.isArray(data) ? data : [])
    } catch (error) {
      setMessage('Failed to fetch rooms.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setNewRoom((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleAddRoom = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRoom,
          capacity: Number(newRoom.capacity),
          price: newRoom.price ? Number(newRoom.price) : '',
          galleryImages: newRoom.galleryImages
            .split('\n')
            .map((image) => image.trim())
            .filter(Boolean),
          details: newRoom.details
            .split('\n')
            .map((detail) => detail.trim())
            .filter(Boolean),
          createdAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add room')
      }

      setNewRoom(emptyRoom)
      setMessage('Room added.')
      fetchRooms()
    } catch (error) {
      setMessage('Failed to add room.')
    } finally {
      setSaving(false)
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
      setMessage('Failed to delete room.')
    }
  }

  const handleToggleAvailability = async (room) => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: room._id,
          isAvailable: room.isAvailable === false,
        }),
      })

      if (response.ok) {
        fetchRooms()
      }
    } catch (error) {
      setMessage('Failed to update room.')
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
          <Link href="/" className="text-sm font-semibold text-stone-700 hover:text-emerald-900">Back to Site</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Rooms</p>
          <h1 className="mt-3 text-4xl font-semibold text-stone-950">Manage hotel rooms</h1>
          <p className="mt-4 leading-7 text-stone-600">
            Rooms marked available will show on the public hotel room booking page with photos, sleeping capacity, nightly price, and details.
          </p>
        </div>

        <form onSubmit={handleAddRoom} className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-stone-950">Add room</h2>
            {message && <p className="text-sm font-medium text-emerald-800">{message}</p>}
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-800">Room name</span>
              <input name="name" value={newRoom.name} onChange={handleChange} required className="field-input" placeholder="Garden Room" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-800">Capacity</span>
              <input type="number" name="capacity" value={newRoom.capacity} onChange={handleChange} min="1" required className="field-input" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-800">Image URL</span>
              <input type="url" name="imageUrl" value={newRoom.imageUrl} onChange={handleChange} className="field-input" placeholder="https://..." />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-800">Gallery image URLs</span>
              <textarea name="galleryImages" value={newRoom.galleryImages} onChange={handleChange} rows="3" className="field-input resize-none" placeholder={'https://...\nhttps://...'} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-800">Room category</span>
              <input name="category" value={newRoom.category} onChange={handleChange} className="field-input" placeholder="Standard double room" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-800">Room size</span>
              <input name="size" value={newRoom.size} onChange={handleChange} className="field-input" placeholder="32 m2" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-800">Bed type</span>
              <input name="bedType" value={newRoom.bedType} onChange={handleChange} className="field-input" placeholder="1 queen bed" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-800">Price</span>
              <input type="number" name="price" value={newRoom.price} onChange={handleChange} min="0" className="field-input" placeholder="250" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-800">Price unit</span>
              <input name="priceUnit" value={newRoom.priceUnit} onChange={handleChange} className="field-input" placeholder="per night" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-800">Fallback price label</span>
              <input name="priceLabel" value={newRoom.priceLabel} onChange={handleChange} className="field-input" placeholder="Price on request" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-stone-800">Price note</span>
              <input name="priceNote" value={newRoom.priceNote} onChange={handleChange} className="field-input" placeholder="Breakfast included. City tax not included." />
            </label>
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-stone-800">Description</span>
              <textarea name="description" value={newRoom.description} onChange={handleChange} required rows="3" className="field-input resize-none" placeholder="A comfortable room above the restaurant for overnight stays." />
            </label>
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-stone-800">Details</span>
              <textarea name="details" value={newRoom.details} onChange={handleChange} rows="4" className="field-input resize-none" placeholder={'Private bathroom\nFree Wi-Fi\nBreakfast available\nAir conditioning'} />
            </label>
          </div>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-3 text-sm font-semibold text-stone-800">
              <input type="checkbox" name="isAvailable" checked={newRoom.isAvailable} onChange={handleChange} className="h-5 w-5 rounded border-stone-300 text-emerald-900 focus:ring-emerald-900" />
              Show as available for booking
            </label>
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">
              <Plus className="h-4 w-4" />
              {saving ? 'Adding...' : 'Add room'}
            </button>
          </div>
        </form>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-stone-950">Existing rooms</h2>
          {loading ? (
            <div className="mt-6 h-40 animate-pulse rounded-[2rem] bg-stone-200" />
          ) : rooms.length === 0 ? (
            <div className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-8 text-stone-600">No rooms added yet.</div>
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomAdminCard
                  key={room._id}
                  room={room}
                  onToggle={() => handleToggleAvailability(room)}
                  onDelete={() => handleDeleteRoom(room._id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function RoomAdminCard({ room, onToggle, onDelete }) {
  const details = Array.isArray(room.details) ? room.details : []

  return (
    <article className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-xl shadow-stone-200/60">
      <div className="relative h-48 bg-stone-200 bg-cover bg-center" style={room.imageUrl ? { backgroundImage: `url(${room.imageUrl})` } : undefined}>
        {!room.imageUrl && (
          <div className="flex h-full items-center justify-center text-stone-500">
            <ImageOff className="h-9 w-9" />
          </div>
        )}
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${room.isAvailable === false ? 'bg-stone-950 text-white' : 'bg-emerald-100 text-emerald-950'}`}>
          {room.isAvailable === false ? 'Hidden' : 'Available'}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-stone-950">{room.name}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-stone-600">
          <UsersRound className="h-4 w-4 text-emerald-800" />
          Up to {room.capacity} guests
        </p>
        {room.priceLabel && <p className="mt-2 text-sm font-semibold text-emerald-900">{room.priceLabel}</p>}
        {room.price && <p className="mt-2 text-sm font-semibold text-emerald-900">EUR {Number(room.price).toLocaleString()} {room.priceUnit || 'per night'}</p>}
        <p className="mt-4 line-clamp-3 leading-7 text-stone-600">{room.description}</p>
        {details.length > 0 && <p className="mt-3 text-sm text-stone-500">{details.length} detail{details.length === 1 ? '' : 's'} added</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={onToggle} className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-50">
            {room.isAvailable === false ? 'Show room' : 'Hide room'}
          </button>
          <button onClick={onDelete} className="inline-flex items-center gap-2 rounded-full border border-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
