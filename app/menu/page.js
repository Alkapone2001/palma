'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Beef, Coffee, Fish, Languages, Leaf, Pizza, Search, Soup, Utensils } from 'lucide-react'
import Header from '../components/Header'
import { menuProducts } from './products'

const sectionIcons = {
  'pizza': Pizza,
  'soups': Soup,
  'rissoto': Utensils,
  'pasta': Utensils,
  'grill': Beef,
  'mix-grill': Beef,
  'fish': Fish,
  'mix-fish': Fish,
  'salads': Leaf,
  'side-dish': Utensils,
  'drinks-and-coctails': Coffee,
}

const categoryDetails = {
  'Pizza': {
    id: 'pizza',
    title: { en: 'Pizza', hr: 'Pizza' },
    tagline: { en: 'Fresh pizza from the Palma 5 ordering menu', hr: 'Pizza iz Palma 5 narudzbenog menija' },
  },
  'Soups': {
    id: 'soups',
    title: { en: 'Soups', hr: 'Juhe' },
    tagline: { en: 'Warm starters and house soups', hr: 'Tople juhe i predjela' },
  },
  'Rissoto': {
    id: 'rissoto',
    title: { en: 'Risotto', hr: 'Rizoto' },
    tagline: { en: 'Creamy risotto dishes', hr: 'Kremasta rizoto jela' },
  },
  'Pasta': {
    id: 'pasta',
    title: { en: 'Pasta', hr: 'Tjestenina' },
    tagline: { en: 'Pasta favourites from the live menu', hr: 'Omiljena jela od tjestenine' },
  },
  'Grill': {
    id: 'grill',
    title: { en: 'Grill', hr: 'Grill' },
    tagline: { en: 'Rich plates from the grill', hr: 'Bogata jela s rostilja' },
  },
  'Mix grill': {
    id: 'mix-grill',
    title: { en: 'Mix grill', hr: 'Mix grill' },
    tagline: { en: 'Sharing plates from the grill', hr: 'Plate za dijeljenje s rostilja' },
  },
  'Fish': {
    id: 'fish',
    title: { en: 'Fish', hr: 'Riba' },
    tagline: { en: 'Seafood and Adriatic favourites', hr: 'Morski i jadranski favoriti' },
  },
  'Mix fish': {
    id: 'mix-fish',
    title: { en: 'Mix fish', hr: 'Riblje plate' },
    tagline: { en: 'Fish platters for the table', hr: 'Riblje plate za stol' },
  },
  'Salads': {
    id: 'salads',
    title: { en: 'Salads', hr: 'Salate' },
    tagline: { en: 'Fresh and light choices', hr: 'Svjezi i lagani izbori' },
  },
  'Side dish': {
    id: 'side-dish',
    title: { en: 'Side dishes', hr: 'Prilozi' },
    tagline: { en: 'Perfect additions', hr: 'Savrseni dodaci' },
  },
  'Drinks and coctails': {
    id: 'drinks-and-coctails',
    title: { en: 'Drinks and cocktails', hr: 'Pica i kokteli' },
    tagline: { en: 'Coffee, soft drinks, beer, wine, spirits, and cocktails', hr: 'Kava, sokovi, pivo, vino, zestoka pica i kokteli' },
  },
}

const categoryOrder = [
  'Pizza',
  'Soups',
  'Rissoto',
  'Pasta',
  'Grill',
  'Mix grill',
  'Fish',
  'Mix fish',
  'Salads',
  'Side dish',
  'Drinks and coctails',
]

const sections = categoryOrder
  .map((category) => {
    const details = categoryDetails[category]
    const items = menuProducts
      .filter((product) => product.category === category)
      .map((product) => item(product.name, product.name, '', '', product.price))

    return items.length ? { ...details, items } : null
  })
  .filter(Boolean)

export default function Menu() {
  const [language, setLanguage] = useState('en')
  const [query, setQuery] = useState('')

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return sections

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((menuItem) => {
          const haystack = [
            menuItem.name.en,
            menuItem.name.hr,
            menuItem.description.en,
            menuItem.description.hr,
            section.title.en,
            section.title.hr,
          ].join(' ').toLowerCase()

          return haystack.includes(normalizedQuery)
        }),
      }))
      .filter((section) => section.items.length > 0)
  }, [query])

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="relative bg-stone-950 pb-20 pt-28 text-white">
        <Header theme="dark" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-100">Palma 5 Menu</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            {language === 'en' ? 'Food, drinks, and Palma signatures.' : 'Hrana, pice i Palma specijaliteti.'}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            {language === 'en'
              ? 'Browse the full Palma 5 menu with prices, from pizza and pasta to seafood, grill plates, salads, sides, coffee, beer, wine, and spirits.'
              : 'Pregledajte cijeli Palma 5 meni s cijenama, od pizza i tjestenine do ribe, grilla, salata, priloga, kave, piva, vina i zestokih pica.'}
          </p>
        </div>
      </div>

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-xl shadow-stone-200/60 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-800 focus:bg-white focus:ring-4 focus:ring-emerald-900/10"
                placeholder={language === 'en' ? 'Search menu...' : 'Pretrazi jelovnik...'}
              />
            </label>
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 p-1">
              <Languages className="ml-3 h-4 w-4 text-emerald-800" />
              {['en', 'hr'].map((option) => (
                <button
                  key={option}
                  onClick={() => setLanguage(option)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold uppercase transition ${language === option ? 'bg-emerald-900 text-white' : 'text-stone-600 hover:bg-white'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="whitespace-nowrap rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-emerald-200 hover:text-emerald-900">
                {section.title[language]}
              </a>
            ))}
          </nav>

          <div className="mt-10 space-y-10">
            {filteredSections.map((section) => (
              <MenuSection key={section.id} section={section} language={language} />
            ))}
          </div>

          {filteredSections.length === 0 && (
            <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-8 text-stone-600">
              {language === 'en' ? 'No menu items found.' : 'Nema pronadenih stavki.'}
            </div>
          )}

          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-[2rem] bg-emerald-950 p-8 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold">{language === 'en' ? 'Ready to join us?' : 'Spremni ste nas posjetiti?'}</h2>
              <p className="mt-2 text-white/70">{language === 'en' ? 'Book a restaurant table or request a hotel room.' : 'Rezervirajte stol u restoranu ili posaljite upit za hotelsku sobu.'}</p>
            </div>
            <Link href="/booking" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-100">
              {language === 'en' ? 'Book now' : 'Rezerviraj'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function MenuSection({ section, language }) {
  const Icon = sectionIcons[section.id] || Utensils

  return (
    <section id={section.id} className="scroll-mt-24 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/60">
      <div className="flex flex-col justify-between gap-5 border-b border-stone-100 pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-3xl font-semibold text-stone-950">{section.title[language]}</h2>
          <p className="mt-2 text-stone-600">{section.tagline[language]}</p>
        </div>
        <p className="rounded-full bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-600">
          {section.items.length} {language === 'en' ? 'items' : 'stavki'}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {section.items.map((menuItem) => (
          <article key={`${section.id}-${menuItem.name.en}-${menuItem.price}`} className="rounded-[1.25rem] border border-stone-100 p-5 transition hover:border-emerald-100 hover:bg-emerald-50/30">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold leading-6 text-stone-950">{menuItem.name[language]}</h3>
              <p className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-emerald-900">{formatPrice(menuItem.price)}</p>
            </div>
            {menuItem.description[language] && (
              <p className="mt-3 text-sm leading-6 text-stone-600">{menuItem.description[language]}</p>
            )}
            {menuItem.badge && (
              <span className="mt-4 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">{menuItem.badge}</span>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function item(nameEn, nameHr, descriptionEn, descriptionHr, price, badge = '') {
  return {
    name: { en: nameEn, hr: nameHr },
    description: { en: descriptionEn, hr: descriptionHr },
    price,
    badge,
  }
}

function formatPrice(price) {
  const value = String(price)
  return value.includes('-') ? `EUR ${value}` : `EUR ${Number(value).toFixed(2)}`
}

