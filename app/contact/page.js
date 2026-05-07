import Link from 'next/link'
import { ArrowRight, Clock, Instagram, MapPin } from 'lucide-react'
import Header from '../components/Header'

export default function Contact() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="relative bg-stone-950 pb-20 pt-28 text-white">
        <Header theme="dark" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-100">Contact</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">Talk to Palma 5.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            For restaurant reservations, hotel room questions, or special requests, reach out and we will help.
          </p>
        </div>
      </div>

      <main className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-xl shadow-stone-200/60">
            <h2 className="text-2xl font-semibold text-stone-950">Visit us</h2>
            <div className="mt-8 space-y-5 text-stone-700">
              <a href="https://www.google.com/maps/search/?api=1&query=Spadici%2054%2C%2052440%2C%20Porec%2C%20Croatia" target="_blank" rel="noreferrer" className="flex gap-3 hover:text-emerald-900">
                <MapPin className="mt-1 h-5 w-5 text-emerald-800" />Spadici 54, 52440, Porec, Croatia
              </a>
              <a href="https://www.instagram.com/pizzeria.palma5?igsh=MWs4aHVtd201ZHR4cQ==" target="_blank" rel="noreferrer" className="flex gap-3 hover:text-emerald-900">
                <Instagram className="mt-1 h-5 w-5 text-emerald-800" />@pizzeria.palma5
              </a>
              <p className="flex gap-3"><Clock className="mt-1 h-5 w-5 text-emerald-800" />Mon-Fri 11am - 10pm, Sat-Sun 12pm - 11pm</p>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-stone-200/60">
            <h2 className="text-2xl font-semibold text-stone-950">Planning to stay?</h2>
            <p className="mt-4 max-w-2xl leading-7 text-stone-600">
              Tell us your check-in date, check-out date, and guest count. We can help with room selection, restaurant tables, and anything you need before arrival.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/booking/table" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
                Book a table
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/booking/room" className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-50">
                Book a room
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
