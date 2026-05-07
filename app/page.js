import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarCheck, DoorOpen, Flame, GlassWater, MapPin, Utensils } from 'lucide-react'
import Header from './components/Header'

const heroImage = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2200&q=85'
const diningImage = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=85'
const roomImage = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85'

const highlights = [
  { icon: Flame, label: 'Seasonal cooking', text: 'Produce-led plates, warm service, and a menu that changes with what tastes best now.' },
  { icon: GlassWater, label: 'Calm atmosphere', text: 'Soft lighting, polished details, and enough space for the table to feel like yours.' },
  { icon: CalendarCheck, label: 'Easy reservations', text: 'Book a table for dinner or reserve a private room for a longer gathering.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <section className="relative min-h-[92vh] overflow-hidden">
        <Header theme="dark" />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-end px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">Palma Restaurant</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.98] sm:text-7xl lg:text-8xl">A warm table for slow evenings.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
              Palma is a modern neighborhood restaurant built around honest food, candlelit rooms, and the quiet pleasure of being looked after well.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/booking/table" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-100">
                Book a table
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/booking/room" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
                Reserve a room
                <DoorOpen className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.label} className="flex gap-4 rounded-2xl p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-stone-950">{item.label}</h2>
                <p className="mt-1 text-sm leading-6 text-stone-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Our restaurant</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">Food with a sense of place.</h2>
            <p className="mt-6 text-lg leading-8 text-stone-600">
              Palma was imagined as the kind of restaurant people return to without needing an occasion. The kitchen keeps things fresh and generous: grilled seafood, handmade pasta, vegetables with real character, and desserts that make the table linger a little longer.
            </p>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              The room is elegant without feeling distant. Come for dinner, bring family on Sunday, or close the doors to a private space when the conversation deserves more time.
            </p>
            <div className="mt-8 flex items-center gap-3 text-stone-700">
              <MapPin className="h-5 w-5 text-emerald-800" />
              <span>123 Restaurant St, City Center</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-5">
            <div className="relative h-[440px] overflow-hidden rounded-[2rem] shadow-2xl shadow-stone-300/70 sm:col-span-3">
              <Image src={diningImage} alt="A warmly lit Palma dining table" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="grid gap-4 sm:col-span-2">
              <div className="rounded-[2rem] bg-emerald-950 p-6 text-white">
                <p className="text-4xl font-semibold">11-10</p>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-emerald-100">Weekday hours</p>
              </div>
              <div className="relative h-[280px] overflow-hidden rounded-[2rem] shadow-xl shadow-stone-300/60">
                <Image src={roomImage} alt="A private dining room at Palma" fill sizes="(min-width: 1024px) 24vw, 100vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-950 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <BookingCard
            icon={Utensils}
            title="Book a table"
            text="For dinner, lunch, date nights, family meals, or a relaxed catch-up with friends."
            href="/booking/table"
          />
          <BookingCard
            icon={DoorOpen}
            title="Reserve a private room"
            text="For birthdays, business dinners, private celebrations, and longer hosted gatherings."
            href="/booking/room"
          />
        </div>
      </section>
    </div>
  )
}

function BookingCard({ icon: Icon, title, text, href }) {
  return (
    <Link href={href} className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition hover:bg-white/[0.08]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-950">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-8 text-3xl font-semibold">{title}</h3>
      <p className="mt-4 max-w-xl leading-7 text-white/68">{text}</p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-100">
        Start request
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
