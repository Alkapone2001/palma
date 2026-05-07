import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, DoorOpen, Utensils } from 'lucide-react'
import Header from '../components/Header'

const options = [
  {
    href: '/booking/table',
    title: 'Book a table',
    label: 'Dining room',
    text: 'Choose this for regular restaurant reservations, from a table for two to a relaxed dinner with friends.',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85',
    icon: Utensils,
  },
  {
    href: '/booking/room',
    title: 'Reserve a private room',
    label: 'Private events',
    text: 'Choose this for birthdays, business dinners, family celebrations, or a more private hosted experience.',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=85',
    icon: DoorOpen,
  },
]

export default function Booking() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="relative bg-stone-950 pb-20 pt-28 text-white">
        <Header theme="dark" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-100">Book Palma</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">What kind of reservation do you need?</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Tables and rooms are handled separately so we can ask the right questions and confirm the right space for you.
          </p>
        </div>
      </div>

      <main className="-mt-12 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          {options.map((option) => (
            <Link key={option.href} href={option.href} className="group overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-stone-200/70">
              <div className="relative h-72 overflow-hidden">
                <Image src={option.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-full bg-white/92 px-4 py-2 text-sm font-semibold text-stone-950">{option.label}</div>
              </div>
              <div className="p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
                  <option.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-6 text-3xl font-semibold text-stone-950">{option.title}</h2>
                <p className="mt-3 leading-7 text-stone-600">{option.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900">
                  Continue
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
