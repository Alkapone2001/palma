import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BedDouble, CalendarCheck, CheckCircle2, Clock, DoorOpen, ExternalLink, Flame, GlassWater, MapPin, Star, Utensils, Wifi } from 'lucide-react'
import Header from './components/Header'

const heroImage = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2200&q=85'
const diningImage = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=85'
const roomImage = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85'
const reviewUrl = 'https://www.google.com/search?sca_esv=b4663fe979d5f511&sxsrf=APpeQnugvXm13cE9NQZ_ItzG3IeIWWcuqA:1783779685836&q=Restaurant+%26+Pizzeria+Palma+5&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-__asMecfCm70KdgLpeXKE4qQoTPJSXbJG1jSKvmk11RGyO1IxB1QP2q0ZzU1uZv4UKK8jEQ%3D&uds=AJ5uw19tc558UO76uNE3i9QYuudM97IoXnbRaq_I1bsFhNHuSkJ3YIHigrWbuddKesDe6heurL0JJgEQlv4GiP0b1TG29LWYGybPDjVtXT_FlZBk74UWHc3qzAD0Kt1yBll9nBr85YfM&sa=X&ved=2ahUKEwjgkKCU6cqVAxVnExAIHVFpAOAQ3PALegQIGRAE&biw=1280&bih=569&dpr=1.5'

const highlights = [
  { icon: Flame, label: 'Seasonal cooking', text: 'Produce-led plates, warm service, and a menu that changes with what tastes best now.' },
  { icon: GlassWater, label: 'Calm atmosphere', text: 'Soft lighting, polished details, and enough space for the table to feel like yours.' },
  { icon: CalendarCheck, label: 'Easy reservations', text: 'Book a table for dinner or request a hotel room for an overnight stay.' },
]

const signatures = [
  ['Palma 5 Pizza', 'Burrata, beefsteak, tomato, gold, cherry tomatoes'],
  ['Palma 5 Fish Platter', 'Mussels, sea bream, scampi, calamari for two'],
  ['Plata Palma 5', 'T-bone, beefsteak, cevapi, pljeskavica, chicken, vegetables'],
]

const stayBenefits = [
  { icon: BedDouble, title: 'Rooms above the restaurant', text: 'Stay close after dinner, drinks, or a long day in Porec.' },
  { icon: Wifi, title: 'Comfort essentials', text: 'Room details such as Wi-Fi, private bathroom, breakfast, and air conditioning are shown before request.' },
  { icon: CheckCircle2, title: 'Approval before confirmation', text: 'Room requests stay pending until Palma 5 confirms availability.' },
]

const faqs = [
  ['Are room bookings instant?', 'No. Room requests are sent as pending first, then Palma 5 confirms or declines them after checking availability.'],
  ['Can I book only a restaurant table?', 'Yes. Table reservations are separate from hotel room bookings and use a shorter restaurant-focused form.'],
  ['Where is Palma 5 located?', 'Spadici 54, 52440, Porec, Croatia.'],
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
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">Palma 5</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.98] sm:text-7xl lg:text-8xl">Restaurant, rooms, and slow evenings.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
              Palma 5 is a restaurant and rooms in Porec, built around honest food, easy hospitality, and the quiet pleasure of being looked after well.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/booking/table" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-100">
                Book a table
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex flex-col gap-3">
                <Link href="/booking/room" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
                  Request a room
                  <DoorOpen className="h-4 w-4" />
                </Link>
                <a href={reviewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200/60 bg-amber-200 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-100">
                  Leave a review
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/78">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur"><Star className="h-4 w-4 text-amber-200" />Palma 5 signatures</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur"><Clock className="h-4 w-4 text-amber-200" />Open daily 08:00-00:00</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur"><MapPin className="h-4 w-4 text-amber-200" />Spadici, Porec</span>
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

      <section className="bg-emerald-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <Stat value="9" label="Menu categories" />
          <Stat value="80+" label="Food and drink items" />
          <Stat value="2" label="Ways to book: table or room" />
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Our restaurant</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">Food with a sense of place.</h2>
            <p className="mt-6 text-lg leading-8 text-stone-600">
              Palma 5 was imagined as the kind of restaurant people return to without needing an occasion. The kitchen keeps things fresh and generous: seafood, pasta, pizza, grill plates, vegetables with real character, and drinks that make the table linger a little longer.
            </p>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              The restaurant is elegant without feeling distant. Come for dinner, bring family on Sunday, or stay overnight in one of Palma 5&apos;s rooms when the evening should last longer.
            </p>
            <div className="mt-8 flex items-center gap-3 text-stone-700">
              <MapPin className="h-5 w-5 text-emerald-800" />
              <span>Spadici 54, 52440, Porec, Croatia</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-5">
            <div className="relative h-[440px] overflow-hidden rounded-[2rem] shadow-2xl shadow-stone-300/70 sm:col-span-3">
              <Image src={diningImage} alt="A warmly lit Palma 5 dining table" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="grid gap-4 sm:col-span-2">
              <div className="rounded-[2rem] bg-emerald-950 p-6 text-white">
                <p className="text-4xl font-semibold">08-00</p>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-emerald-100">Daily hours</p>
              </div>
              <div className="relative h-[280px] overflow-hidden rounded-[2rem] shadow-xl shadow-stone-300/60">
                <Image src={roomImage} alt="A comfortable hotel room at Palma 5" fill sizes="(min-width: 1024px) 24vw, 100vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Menu highlights</p>
            <h2 className="mt-4 text-4xl font-semibold text-stone-950">The dishes people remember.</h2>
            <p className="mt-5 leading-8 text-stone-600">
              The full bilingual menu is available online, with prices for pizza, pasta, fish, grill, salads, soups, sides, drinks, coffee, beer, wine, and spirits.
            </p>
            <Link href="/menu" className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
              View full menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {signatures.map(([title, text]) => (
              <div key={title} className="rounded-[1.5rem] border border-stone-200 p-6">
                <Star className="h-5 w-5 text-amber-500" />
                <h3 className="mt-5 text-xl font-semibold text-stone-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Stay at Palma 5</p>
            <h2 className="mt-4 text-4xl font-semibold text-stone-950">Dinner downstairs. A room upstairs.</h2>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              Guests can view room photos, details, nightly price, and sleeping capacity before sending a stay request. Every room booking stays pending until Palma 5 confirms availability.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {stayBenefits.map((benefit) => (
              <div key={benefit.title} className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-stone-950">{benefit.title}</h3>
                <p className="mt-3 leading-7 text-stone-600">{benefit.text}</p>
              </div>
            ))}
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
            title="Book a hotel room"
            text="For guests who want to sleep at Palma 5 after dinner, travel, or a longer stay in town."
            href="/booking/room"
          />
        </div>
      </section>

      <section id="reviews" className="border-b border-stone-200 bg-emerald-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Guest reviews</p>
            <h2 className="mt-4 text-4xl font-semibold text-stone-950">Share your Palma 5 experience.</h2>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              Reviews help new guests choose their table, plan a stay, and find the dishes worth coming back for.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-100 bg-white p-7 shadow-xl shadow-emerald-900/5">
            <div className="flex flex-wrap gap-1 text-amber-500" aria-label="Five stars">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="h-6 w-6 fill-current" />
              ))}
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-stone-950">Leave a review on Google</h3>
            <p className="mt-3 leading-7 text-stone-600">
              Tap the button to open the Palma 5 profile, then choose reviews to share your rating and comment.
            </p>
            <a
              href={reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Leave a review
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Good to know</p>
            <h2 className="mt-4 text-4xl font-semibold text-stone-950">Simple answers before guests book.</h2>
          </div>
          <div className="space-y-4">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-[1.5rem] border border-stone-200 p-6">
                <h3 className="font-semibold text-stone-950">{question}</h3>
                <p className="mt-2 leading-7 text-stone-600">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
      <p className="text-4xl font-semibold">{value}</p>
      <p className="mt-2 text-sm uppercase tracking-[0.18em] text-emerald-100">{label}</p>
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
