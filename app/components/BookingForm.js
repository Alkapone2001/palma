'use client'

import { useState } from 'react'
import { CalendarDays, CheckCircle2, Clock, DoorOpen, Mail, MessageSquare, Phone, UserRound, UsersRound } from 'lucide-react'

const baseFields = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  occasion: '',
  reason: '',
  setup: '',
  duration: '',
  notes: '',
}

export default function BookingForm({ type, title, description, submitLabel, details = [], selectedRoom = null }) {
  const today = new Date().toISOString().slice(0, 10)
  const getInitialData = () => ({
    ...baseFields,
    type,
    ...(selectedRoom
      ? {
          roomId: selectedRoom._id,
          roomName: selectedRoom.name,
          guests: selectedRoom.capacity ? Math.min(Number(selectedRoom.capacity), baseFields.guests) : baseFields.guests,
        }
      : {}),
  })

  const [formData, setFormData] = useState(getInitialData)
  const [status, setStatus] = useState('idle')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
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
          guests: Number(formData.guests),
          status: 'pending',
          createdAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Booking failed')
      }

      setStatus('success')
      setFormData(getInitialData())
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <section className="bg-stone-50 px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <aside className="lg:sticky lg:top-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Reservations</p>
          <h1 className="mt-4 text-4xl font-semibold text-stone-950 sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600">{description}</p>
          <div className="mt-8 space-y-3">
            {details.map((detail) => (
              <div key={detail} className="flex items-center gap-3 text-stone-700">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-2xl shadow-stone-200/70 sm:p-8">
          {selectedRoom && (
            <div className="mb-7 rounded-[1.5rem] bg-emerald-950 p-5 text-white">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <DoorOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">Selected room</p>
                  <h2 className="mt-2 text-2xl font-semibold">{selectedRoom.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Up to {selectedRoom.capacity || 'your'} guests{selectedRoom.priceLabel ? ` - ${selectedRoom.priceLabel}` : selectedRoom.price ? ` - $${Number(selectedRoom.price).toLocaleString()}` : ''}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <Field icon={UserRound} label="Full name">
              <input name="name" value={formData.name} onChange={handleChange} required className="field-input" placeholder="Your name" />
            </Field>
            <Field icon={Mail} label="Email">
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="field-input" placeholder="you@example.com" />
            </Field>
            <Field icon={Phone} label="Phone">
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="field-input" placeholder="+1 555 0123" />
            </Field>
            <Field icon={UsersRound} label={type === 'room' ? 'Guests in room' : 'Guests at table'}>
              <input type="number" name="guests" value={formData.guests} onChange={handleChange} min="1" required className="field-input" />
            </Field>
            <Field icon={CalendarDays} label="Date">
              <input type="date" name="date" value={formData.date} onChange={handleChange} min={today} required className="field-input" />
            </Field>
            <Field icon={Clock} label="Time">
              <input type="time" name="time" value={formData.time} onChange={handleChange} required className="field-input" />
            </Field>
            {type === 'room' ? (
              <>
                <label className="md:col-span-2">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-800">
                    <MessageSquare className="h-4 w-4 text-emerald-800" />
                    Reason for booking the room
                  </span>
                  <select name="reason" value={formData.reason} onChange={handleChange} required className="field-input">
                    <option value="">Select reason</option>
                    <option value="birthday celebration">Birthday celebration</option>
                    <option value="business dinner">Business dinner</option>
                    <option value="family gathering">Family gathering</option>
                    <option value="private party">Private party</option>
                    <option value="meeting or presentation">Meeting or presentation</option>
                    <option value="other private event">Other private event</option>
                  </select>
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-stone-800">Room setup</span>
                  <select name="setup" value={formData.setup} onChange={handleChange} className="field-input">
                    <option value="">Select setup</option>
                    <option value="single long table">Single long table</option>
                    <option value="separate tables">Separate tables</option>
                    <option value="presentation setup">Presentation setup</option>
                    <option value="cocktail standing">Cocktail standing</option>
                    <option value="not sure">Not sure yet</option>
                  </select>
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-stone-800">Expected duration</span>
                  <select name="duration" value={formData.duration} onChange={handleChange} className="field-input">
                    <option value="">Select duration</option>
                    <option value="up to 2 hours">Up to 2 hours</option>
                    <option value="2-3 hours">2-3 hours</option>
                    <option value="3-4 hours">3-4 hours</option>
                    <option value="full evening">Full evening</option>
                  </select>
                </label>
              </>
            ) : (
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-stone-800">Occasion</span>
                <select name="occasion" value={formData.occasion} onChange={handleChange} className="field-input">
                  <option value="">Optional</option>
                  <option value="casual dinner">Casual dinner</option>
                  <option value="date night">Date night</option>
                  <option value="business">Business</option>
                  <option value="birthday">Birthday</option>
                  <option value="family gathering">Family gathering</option>
                </select>
              </label>
            )}
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-stone-800">{type === 'room' ? 'Event notes' : 'Notes'}</span>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" className="field-input resize-none" placeholder={type === 'room' ? 'Tell us about the event, menu needs, privacy, decorations, or anything the team should prepare.' : 'Allergies, stroller space, preferred area, or anything else.'} />
            </label>
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="rounded-full bg-emerald-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'submitting' ? 'Sending request...' : submitLabel}
            </button>
            {status === 'success' && <p className="text-sm font-medium text-emerald-700">Request sent. Palma 5 will confirm shortly.</p>}
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
