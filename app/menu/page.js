import Link from 'next/link'
import { ArrowRight, Leaf, Soup, Sparkles } from 'lucide-react'
import Header from '../components/Header'

const menuSections = [
  {
    title: 'From the kitchen',
    icon: Soup,
    items: [
      { name: 'Grilled Salmon', description: 'Fresh salmon, herbs, lemon, olive oil potatoes', price: '$25' },
      { name: 'Beef Steak', description: 'Prime cut beef, garlic butter, seasonal greens', price: '$30' },
      { name: 'Pasta Carbonara', description: 'Creamy pasta, pancetta, parmesan, black pepper', price: '$18' },
    ],
  },
  {
    title: 'Fresh and light',
    icon: Leaf,
    items: [
      { name: 'Caesar Salad', description: 'Crisp romaine, parmesan, house dressing', price: '$12' },
      { name: 'Market Vegetables', description: 'Charred seasonal vegetables, herb yogurt', price: '$14' },
    ],
  },
  {
    title: 'Finish sweet',
    icon: Sparkles,
    items: [
      { name: 'Chocolate Cake', description: 'Warm chocolate cake, vanilla ice cream', price: '$8' },
      { name: 'Citrus Cream', description: 'Lemon cream, shortbread, fresh mint', price: '$9' },
    ],
  },
]

export default function Menu() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="relative bg-stone-950 pb-20 pt-28 text-white">
        <Header theme="dark" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-100">Menu</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">Simple food, carefully made.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            A compact menu lets the kitchen focus on freshness, texture, and the kind of flavors that make a table go quiet for a moment.
          </p>
        </div>
      </div>

      <main className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {menuSections.map((section) => (
            <section key={section.title} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
                <section.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-stone-950">{section.title}</h2>
              <div className="mt-6 space-y-6">
                {section.items.map((item) => (
                  <div key={item.name} className="border-t border-stone-100 pt-5 first:border-t-0 first:pt-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-stone-950">{item.name}</h3>
                      <p className="font-semibold text-emerald-900">{item.price}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-start justify-between gap-5 rounded-[2rem] bg-emerald-950 p-8 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Ready to join us?</h2>
            <p className="mt-2 text-white/70">Choose a dining table or a private room and send a reservation request.</p>
          </div>
          <Link href="/booking" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-100">
            Book now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  )
}
