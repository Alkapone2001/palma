'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, CalendarDays, CheckCircle2, DoorOpen, ImageOff, Mail, Maximize2, Phone, Sparkles, UserRound, UsersRound } from 'lucide-react'

export default function RoomBookingClient() {
  const [rooms, setRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch('/api/rooms')
        if (!response.ok) {
          throw new Error('Failed to fetch rooms')
        }
        const data = await response.json()
        setRooms(data)
      } catch (fetchError) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  const availableRooms = useMemo(
    () => rooms.filter((room) => room.isAvailable !== false),
    [rooms],
  )

  const handleViewRoom = (room) => {
    setActiveRoom(room)
    window.requestAnimationFrame(() => {
      document.getElementById('room-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleSelectRoom = (room) => {
    setSelectedRoom(room)
    window.requestAnimationFrame(() => {
      document.getElementById('room-request')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <>
      <section className="bg-stone-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Hotel rooms</p>
            <h1 className="mt-4 text-4xl font-semibold text-stone-950 sm:text-5xl">Choose a room for your stay.</h1>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              Palma 5 is a restaurant with rooms for overnight stays. View room details, price, and sleeping capacity, then request approval for your stay.
            </p>
          </div>

          {loading && (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-[430px] animate-pulse rounded-[2rem] bg-stone-200" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mt-10 rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-800">
              Rooms could not be loaded right now.
            </div>
          )}

          {!loading && !error && availableRooms.length === 0 && (
            <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-xl shadow-stone-200/60">
              <DoorOpen className="h-10 w-10 text-emerald-800" />
              <h2 className="mt-5 text-2xl font-semibold text-stone-950">No rooms are published yet.</h2>
              <p className="mt-3 max-w-2xl leading-7 text-stone-600">
                Add hotel rooms from the admin page and mark them available. They will appear here with photos, sleeping capacity, prices, and details.
              </p>
            </div>
          )}

          {!loading && availableRooms.length > 0 && (
            <div className="mt-10 space-y-6">
              {availableRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  active={activeRoom?._id === room._id}
                  onView={() => handleViewRoom(room)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {activeRoom && (
        <RoomDetail
          room={activeRoom}
          onBack={() => setActiveRoom(null)}
          onReserve={() => handleSelectRoom(activeRoom)}
        />
      )}

      <div id="room-request">
        {selectedRoom ? (
          <HotelRoomBookingForm
            key={selectedRoom._id}
            room={selectedRoom}
          />
        ) : (
          <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 rounded-[2rem] border border-stone-200 p-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-semibold text-stone-950">View a room to continue.</h2>
                <p className="mt-2 text-stone-600">Open a hotel room above to see full details and price, then request the stay.</p>
              </div>
              <ArrowDown className="h-6 w-6 text-emerald-800" />
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function RoomCard({ room, active, onView }) {
  const details = Array.isArray(room.details)
    ? room.details
    : String(room.details || '')
        .split('\n')
        .map((detail) => detail.trim())
        .filter(Boolean)

  const priceText = getRoomPrice(room)

  return (
    <article className={`grid overflow-hidden rounded-[1.5rem] border bg-white shadow-xl shadow-stone-200/60 transition lg:grid-cols-[300px_1fr_250px] ${active ? 'border-emerald-800 ring-4 ring-emerald-900/10' : 'border-stone-200 hover:shadow-2xl'}`}>
      <div
        className="relative min-h-72 bg-stone-200 bg-cover bg-center lg:min-h-full"
        style={room.imageUrl ? { backgroundImage: `url(${room.imageUrl})` } : undefined}
      >
        {!room.imageUrl && (
          <div className="flex h-full items-center justify-center text-stone-500">
            <ImageOff className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
        <div className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-950 shadow">
          {room.category || 'Hotel room'}
        </div>
      </div>

      <div className="p-6 lg:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-950">{room.name}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <RoomBadge icon={UsersRound}>Up to {room.capacity} guests</RoomBadge>
              {room.size && <RoomBadge icon={Maximize2}>{room.size}</RoomBadge>}
              {room.bedType && <RoomBadge icon={DoorOpen}>{room.bedType}</RoomBadge>}
            </div>
          </div>
          {active && <CheckCircle2 className="h-6 w-6 text-emerald-800" />}
        </div>
        <p className="mt-5 max-w-3xl leading-7 text-stone-600">{room.description}</p>
        {details.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {details.slice(0, 6).map((detail) => (
              <div key={detail} className="flex gap-2 text-sm text-stone-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between border-t border-stone-200 bg-stone-50 p-6 lg:border-l lg:border-t-0">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Nightly price</p>
          <div className="mt-4">
            <p className="text-3xl font-semibold text-stone-950">{priceText.main}</p>
            <p className="mt-1 text-sm text-stone-500">{priceText.sub}</p>
          </div>
          {room.priceNote && (
            <p className="mt-4 rounded-2xl bg-white p-3 text-sm leading-6 text-stone-600">{room.priceNote}</p>
          )}
          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-800">
            <Sparkles className="h-4 w-4" />
            Approval required
          </div>
        </div>
        <button
          type="button"
          onClick={onView}
          className="mt-6 w-full rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          {active ? 'Viewing details' : 'View room'}
        </button>
      </div>
    </article>
  )
}

function RoomDetail({ room, onBack, onReserve }) {
  const details = Array.isArray(room.details)
    ? room.details
    : String(room.details || '')
        .split('\n')
        .map((detail) => detail.trim())
        .filter(Boolean)

  const priceText = getRoomPrice(room)
  const extraImages = getGalleryImages(room)

  return (
    <section id="room-detail" className="border-y border-stone-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-emerald-900">
          <ArrowLeft className="h-4 w-4" />
          Back to rooms
        </button>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <div className="grid gap-3 overflow-hidden rounded-[1.5rem] sm:grid-cols-[1.4fr_0.8fr]">
              <div
                className="relative min-h-[390px] bg-stone-200 bg-cover bg-center"
                style={room.imageUrl ? { backgroundImage: `url(${room.imageUrl})` } : undefined}
              >
                {!room.imageUrl && (
                  <div className="flex h-full items-center justify-center text-stone-500">
                    <ImageOff className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="grid gap-3">
                {extraImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="min-h-[188px] bg-stone-200 bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">{room.category || 'Hotel room'}</p>
              <h2 className="mt-3 text-4xl font-semibold text-stone-950">{room.name}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <RoomBadge icon={UsersRound}>Up to {room.capacity} guests</RoomBadge>
                {room.size && <RoomBadge icon={Maximize2}>{room.size}</RoomBadge>}
                {room.bedType && <RoomBadge icon={DoorOpen}>{room.bedType}</RoomBadge>}
              </div>
              <p className="mt-6 max-w-4xl text-lg leading-8 text-stone-600">{room.description}</p>
            </div>

            <div className="mt-10 rounded-[1.5rem] border border-stone-200 p-6">
              <h3 className="text-2xl font-semibold text-stone-950">Room details</h3>
              {details.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {details.map((detail) => (
                    <div key={detail} className="flex gap-3 text-stone-700">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-stone-600">No extra details have been added for this room yet.</p>
              )}
            </div>
          </div>

          <aside className="sticky top-6 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-6 shadow-2xl shadow-stone-200/70">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">Nightly price</p>
            <div className="mt-4 border-b border-stone-200 pb-5">
              <p className="text-4xl font-semibold text-stone-950">{priceText.main}</p>
              <p className="mt-1 text-sm text-stone-500">{priceText.sub}</p>
            </div>
            {room.priceNote && <p className="mt-5 rounded-2xl bg-white p-4 text-sm leading-6 text-stone-600">{room.priceNote}</p>}
            <div className="mt-6 space-y-3 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-4">
                <span>Capacity</span>
                <strong className="text-stone-950">{room.capacity} guests</strong>
              </div>
              {room.size && (
                <div className="flex items-center justify-between gap-4">
                  <span>Size</span>
                  <strong className="text-stone-950">{room.size}</strong>
                </div>
              )}
              {room.bedType && (
                <div className="flex items-center justify-between gap-4">
                  <span>Bed</span>
                  <strong className="text-stone-950">{room.bedType}</strong>
                </div>
              )}
            </div>
            <button type="button" onClick={onReserve} className="mt-7 w-full rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
              Request this room
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-stone-500">Room stays are requested first. Admin approval confirms the booking.</p>
          </aside>
        </div>
      </div>
    </section>
  )
}

function RoomBadge({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700">
      <Icon className="h-4 w-4 text-emerald-800" />
      {children}
    </span>
  )
}

function getRoomPrice(room) {
  if (room.price) {
    return {
      main: `$${Number(room.price).toLocaleString()}`,
      sub: room.priceUnit || 'per night',
    }
  }

  return {
    main: room.priceLabel || 'Price on request',
    sub: room.priceLabel ? 'price label' : 'we confirm after request',
  }
}

function HotelRoomBookingForm({ room }) {
  const [formData, setFormData] = useState({
    type: 'room',
    roomId: room._id,
    roomName: room.name,
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    guests: 1,
    notes: '',
  })
  const [status, setStatus] = useState('idle')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => {
      const next = { ...current, [name]: value }
      const adults = Number(name === 'adults' ? value : next.adults)
      const children = Number(name === 'children' ? value : next.children)
      return { ...next, guests: adults + children }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('submitting')

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          adults: Number(formData.adults),
          children: Number(formData.children),
          guests: Number(formData.guests),
          status: 'pending',
          createdAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) throw new Error('Room booking failed')
      setStatus('success')
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <section className="bg-stone-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <aside>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Room stay</p>
          <h2 className="mt-4 text-4xl font-semibold text-stone-950">Request your stay</h2>
          <p className="mt-5 text-lg leading-8 text-stone-600">
            Send your check-in and check-out dates. The admin team will approve the request once the room is confirmed available.
          </p>
          <div className="mt-8 rounded-[1.5rem] bg-emerald-950 p-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">Selected room</p>
            <h3 className="mt-2 text-2xl font-semibold">{room.name}</h3>
            <p className="mt-2 text-sm text-white/70">Up to {room.capacity} guests</p>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-2xl shadow-stone-200/70 sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <Field icon={CalendarDays} label="Check-in">
              <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required className="field-input" />
            </Field>
            <Field icon={CalendarDays} label="Check-out">
              <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required className="field-input" />
            </Field>
            <Field icon={UsersRound} label="Adults">
              <input type="number" name="adults" value={formData.adults} onChange={handleChange} min="1" max={room.capacity || 20} required className="field-input" />
            </Field>
            <Field icon={UsersRound} label="Children">
              <input type="number" name="children" value={formData.children} onChange={handleChange} min="0" max={room.capacity || 20} className="field-input" />
            </Field>
            <Field icon={UserRound} label="Full name">
              <input name="name" value={formData.name} onChange={handleChange} required className="field-input" placeholder="Your name" />
            </Field>
            <Field icon={Mail} label="Email">
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="field-input" placeholder="you@example.com" />
            </Field>
            <Field icon={Phone} label="Phone">
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="field-input" placeholder="+1 555 0123" />
            </Field>
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-stone-800">Special requests</span>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" className="field-input resize-none" placeholder="Arrival time, breakfast needs, extra bed, parking, or anything else." />
            </label>
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button type="submit" disabled={status === 'submitting' || status === 'success'} className="rounded-full bg-emerald-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70">
              {status === 'submitting' ? 'Sending request...' : status === 'success' ? 'Request sent' : 'Request approval'}
            </button>
            {status === 'success' && <p className="text-sm font-medium text-emerald-700">Room request sent. Admin approval is pending.</p>}
            {status === 'error' && <p className="text-sm font-medium text-red-700">Something went wrong. Please try again.</p>}
          </div>
        </form>
      </div>
    </section>
  )
}

function Field({ icon: Icon, label, children }) {
  return (
    <label>
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-800">
        <Icon className="h-4 w-4 text-emerald-800" />
        {label}
      </span>
      {children}
    </label>
  )
}

function getGalleryImages(room) {
  const gallery = Array.isArray(room.galleryImages)
    ? room.galleryImages
    : String(room.galleryImages || '')
        .split('\n')
        .map((image) => image.trim())
        .filter(Boolean)

  if (gallery.length >= 2) {
    return gallery.slice(0, 2)
  }

  if (room.imageUrl) {
    return [room.imageUrl, room.imageUrl]
  }

  return []
}
