'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Beef, Coffee, Fish, Languages, Leaf, Pizza, Search, Soup, Utensils } from 'lucide-react'
import Header from '../components/Header'

const sectionIcons = {
  pizza: Pizza,
  special: Pizza,
  pasta: Utensils,
  fish: Fish,
  grill: Beef,
  salads: Leaf,
  soups: Soup,
  sides: Utensils,
  drinks: Coffee,
}

const sections = [
  {
    id: 'pizza',
    title: { en: 'Pizza', hr: 'Pizza' },
    tagline: { en: 'Crispy classics from the oven', hr: 'Hrskavi klasici iz peci' },
    items: [
      item('Margherita', 'Margherita', 'Tomato, mozzarella', 'Rajcica, mozzarella', '8.00'),
      item('Vesuvio', 'Vesuvio', 'Tomato, mozzarella, ham', 'Rajcica, mozzarella, sunka', '10.00'),
      item('Capriciosa', 'Capriciosa', 'Tomato, mozzarella, ham, mushrooms', 'Rajcica, mozzarella, sunka, gljive', '10.00'),
      item('Funghi', 'Funghi', 'Tomato, mozzarella, mushrooms', 'Rajcica, mozzarella, gljive', '9.00'),
      item('Salami', 'Salami', 'Tomato, mozzarella, salami', 'Rajcica, mozzarella, salami', '10.00'),
      item('Hawai', 'Hawai', 'Tomato, mozzarella, ham, pineapple', 'Rajcica, mozzarella, sunka, ananas', '10.00'),
      item('Kulen', 'Kulen', 'Tomato, mozzarella, kulen', 'Rajcica, mozzarella, kulen', '10.00'),
      item('Piccante', 'Piccante', 'Tomato, mozzarella, kulen, onion, hot pepperoni', 'Rajcica, mozzarella, kulen, luk, ljuti feferoni', '10.50'),
      item('Piccante 2.0', 'Piccante 2.0', 'Tomato, mozzarella, ham, kulen, pancetta, onion, hot pepperoni', 'Rajcica, mozzarella, sunka, kulen, panceta, luk, ljuti feferoni', '10.50'),
      item('Diavolo', 'Diavolo', 'Tomato, mozzarella, ham, kulen, pepperoni, hot peppers', 'Rajcica, mozzarella, sunka, kulen, feferoni, ljute papricice', '12.50'),
      item('Siciliana', 'Siciliana', 'Tomato, salty anchovies, olive oil, garlic', 'Rajcica, slani incuni, maslinovo ulje, cesnjak', '10.50'),
      item('Tuna', 'Tuna', 'Tomato, mozzarella, tuna, onion, capers', 'Rajcica, mozzarella, tuna, luk, kapari', '11.00'),
      item('Frutti di Mare', 'Frutti di Mare', 'Tomato, mozzarella, seafood', 'Rajcica, mozzarella, plodovi mora', '11.50'),
      item('Quatro Formaggi', 'Quatro Formaggi', 'Tomato, mozzarella, gouda, gorgonzola, grana padano', 'Rajcica, mozzarella, gouda, gorgonzola, grana padano', '10.00'),
      item('Prosciutto Crudo', 'Prosciutto Crudo', 'Tomato, mozzarella, prosciutto, arugula, grana padano, cherry tomatoes', 'Rajcica, mozzarella, prsut, rukola, grana padano, cherry rajcice', '14.00'),
      item('Vegetariana', 'Vegetariana', 'Tomato, mozzarella, vegetables, burrata', 'Rajcica, mozzarella, povrce, burrata', '10.50'),
      item('Slavonska', 'Slavonska', 'Tomato, mozzarella, ham, kulen, sausage, pepper, onion, pepperoni, cream', 'Rajcica, mozzarella, sunka, kulen, kobasica, paprika, luk, feferoni, vrhnje', '13.00'),
      item('Calzone', 'Calzone', 'Tomato, mozzarella, ham', 'Rajcica, mozzarella, sunka', '10.00'),
    ],
  },
  {
    id: 'special',
    title: { en: 'Special Pizza', hr: 'Posebne pizze' },
    tagline: { en: 'Premium Palma 5 signatures', hr: 'Premium Palma 5 specijaliteti' },
    items: [
      item('Mortadella Burrata', 'Mortadella Burrata', 'White sauce, mozzarella, mortadella, pistachio, burrata, cherry tomatoes, balsamic cream', 'Bijeli umak, mozzarella, mortadella, pistacija, burrata, cherry rajcice, balsamico krema', '20.00', 'Chef choice'),
      item('Slavonska 2.0 Premium', 'Slavonska 2.0 Premium', 'Tomato, mozzarella, black Slavonian pig kulen, burrata', 'Rajcica, mozzarella, kulen slavonske crne svinje, burrata', '20.00'),
      item('Palma 5 Pizza', 'Palma 5 Pizza', 'Tomato, burrata, beefsteak, gold, cherry tomatoes', 'Rajcica, burrata, biftek, zlato, cherry rajcice', '45.00', 'Signature'),
    ],
  },
  {
    id: 'pasta',
    title: { en: 'Pasta', hr: 'Tjestenina' },
    tagline: { en: 'Comforting Italian favourites', hr: 'Omiljeni talijanski klasici' },
    items: [
      item('Spaghetti Carbonara', 'Spaghetti Carbonara', 'Spaghetti alla carbonara', 'Spaghetti alla carbonara', '10.00'),
      item('Spaghetti Bolognese', 'Spaghetti Bolognese', 'Spaghetti alla Bolognese', 'Spaghetti alla Bolognese', '11.00'),
      item('Pasta Curry', 'Pasta Curry', 'Pasta curry', 'Pasta curry', '10.00'),
      item('Spaghetti Frutti di Mare', 'Spaghetti Frutti di Mare', 'Spaghetti with seafood', 'Spaghetti s plodovima mora', '12.50'),
      item('Spaghetti Napoletana', 'Spaghetti Napoletana', 'Spaghetti with tomato sauce', 'Spaghetti s umakom od rajcice', '10.00'),
      item('Spaghetti Seafood, Mussels & Garlic', 'Spaghetti plodovi mora, dagnje i cesnjak', 'Spaghetti with seafood, mussels, garlic', 'Spaghetti plodovi mora, dagnje, cesnjak', '12.00'),
      item('Penne Pesto', 'Penne Pesto', 'Penne pesto, basil', 'Penne pesto, bosiljak', '9.00'),
      item('Tagliatelle Frutti di Mare', 'Tagliatelle Frutti di Mare', 'Tagliatelle with seafood', 'Tagliatelle s plodovima mora', '12.50'),
      item('Tagliatelle Broccoli', 'Tagliatelle Broccoli', 'Tagliatelle with broccoli', 'Tagliatelle s brokulom', '10.50'),
      item('Pasta Vegetariana', 'Pasta Vegetariana', 'Penne, spaghetti or tagliatelle with vegetables', 'Penne, spaghetti ili tagliatelle s povrcem', '9.50'),
      item('Lasagne', 'Lasagne', 'Bolognese, mushrooms or vegetarian', 'Bolognese, gljive ili vegetarijanske', '9.00'),
    ],
  },
  {
    id: 'fish',
    title: { en: 'Fish', hr: 'Riba' },
    tagline: { en: 'Seafood and Adriatic favourites', hr: 'Morski i jadranski favoriti' },
    items: [
      item('Mussels Buzara', 'Dagnje na buzaru', 'Mussels buzara style', 'Dagnje na buzaru', '15.00'),
      item('Shrimp Buzara', 'Skampi na buzaru', 'Shrimp buzara style', 'Skampi na buzaru', '25.00'),
      item('Sea Bass', 'Brancin', 'Swiss chard, potatoes, fries, vegetables', 'Blitva, krumpir, pomes, povrce', '17.00'),
      item('Sea Bream', 'Orada', 'Swiss chard, potatoes, fries, vegetables', 'Blitva, krumpir, pomes, povrce', '17.00'),
      item('Grilled Squid', 'Lignje na zaru', 'Grilled squid', 'Lignje na zaru', '12.50'),
      item('Stuffed Squid', 'Punjene lignje', 'Stuffed squid', 'Punjene lignje', '13.50'),
      item('Fried Squid', 'Przene lignje', 'Fried squid', 'Przene lignje', '11.00'),
      item('Turbot Fish', 'List', 'Turbot fish', 'List / Sogliola', '20.00'),
      item('Fish Mix Platter', 'Riblja mix plata', 'For 2 people: mussels, sea bass, sea bream', 'Za 2 osobe: dagnje, brancin, orada', '50.00'),
      item('Palma 5 Fish Platter', 'Riblja plata Palma 5', 'For 2 people: mussels, sea bream, scampi, calamari', 'Za 2 osobe: dagnje, orada, skampi, lignje', '65.00'),
    ],
  },
  {
    id: 'grill',
    title: { en: 'Grill', hr: 'Grill' },
    tagline: { en: 'Rich plates from the grill', hr: 'Bogata jela s rostilja' },
    items: [
      item('T-Bone Steak in Hunting Sauce', 'T-Bone steak u lovackom umaku', '', '', '25.00'),
      item('Beefsteak in Garlic Sauce', 'Biftek u umaku od cesnjaka', '', '', '23.50'),
      item('Beefsteak in Pepper Sauce', 'Biftek u umaku od papra', '', '', '23.50'),
      item('Beefsteak in Mushroom Sauce', 'Biftek u umaku od gljiva', '', '', '23.50'),
      item('Rumpsteak in Mushroom Sauce', 'Ramstek u umaku od gljiva', '', '', '21.00'),
      item('Hamburger', 'Hamburger', 'Burger meat, sauce, lettuce, tomato, pickles', 'Meso, umak, salata, rajcica, kiseli krastavci', '6.50'),
      item('Cheeseburger', 'Cheeseburger', 'Burger meat, sauce, lettuce, tomato, pickles, cheddar cheese', 'Meso, umak, salata, rajcica, kiseli krastavci, cheddar sir', '7.00'),
      item('Breaded Chicken', 'Pohana piletina', '', '', '9.00'),
      item('Nuggets', 'Nuggets', '', '', '8.00'),
      item('Pljeskavica', 'Pljeskavica', 'Balkan minced meat', 'Balkansko mljeveno meso', '11.00'),
      item('Pljeskavica with Cheese', 'Pljeskavica sa sirom', 'Balkan minced meat with cheese', 'Balkansko mljeveno meso sa sirom', '12.00'),
      item('Gourmet Pljeskavica', 'Gurmanska pljeskavica', 'Gourmet minced meat', 'Gurmansko mljeveno meso', '12.50'),
      item('Cevapi Small - 5 pcs', 'Cevapi mali - 5 kom', '', '', '6.00'),
      item('Cevapi Large - 10 pcs', 'Cevapi veliki - 10 kom', '', '', '12.00'),
      item('Wiener Schnitzel', 'Becki odrezak', '', '', '12.00'),
      item('Chicken Steak', 'Pileci steak', '', '', '11.00'),
      item('Grill Mix Platter', 'Grill mix plata', 'For 2 people: pljeskavica, cevapi, chicken, Wiener schnitzel, ajvar, onion, fries, djuvec', 'Za 2 osobe: pljeskavica, cevapi, piletina, becki odrezak, ajvar, luk, pomfrit, djuvec', '35.00'),
      item('Plata Palma 5', 'Plata Palma 5', 'For 2 people: T-bone steak, beefsteak, cevapi, pljeskavica, breaded chicken, sauces, grilled vegetables, fries', 'Za 2 osobe: T-bone steak, biftek, cevapi, pljeskavica, pohana piletina, umaci, povrce na zaru, pomfrit', '70.00', 'Signature'),
    ],
  },
  {
    id: 'salads',
    title: { en: 'Salads', hr: 'Salate' },
    tagline: { en: 'Fresh and light choices', hr: 'Svjezi i lagani izbori' },
    items: [
      item('Cabbage Salad', 'Salata od kupusa', '', '', '5.50'),
      item('Green Salad', 'Zelena salata', '', '', '4.50'),
      item('Tomato Salad', 'Salata od rajcice', '', '', '4.50'),
      item('Caprese Salad', 'Caprese salata', '', '', '5.50'),
      item('Greek Salad', 'Grcka salata', '', '', '5.50'),
      item('Chicken Salad', 'Pileca salata', '', '', '8.00'),
      item('Squid Salad', 'Salata od lignji', '', '', '8.50'),
      item('Scampi Cocktail', 'Koktel od skampa', '', '', '10.00'),
      item('Capriciosa Salad', 'Capriciosa salata', '', '', '7.00'),
    ],
  },
  {
    id: 'soups',
    title: { en: 'Soups & Risotto', hr: 'Juhe i rizoto' },
    tagline: { en: 'Warm starters and creamy risotto', hr: 'Tople juhe i kremasti rizoto' },
    items: [
      item('Tomato Soup', 'Juha od rajcice', '', '', '5.00'),
      item('Vegetable Soup', 'Juha od povrca', '', '', '5.00'),
      item('Fish Soup', 'Riblja juha', '', '', '5.00'),
      item('Seafood Risotto', 'Rizoto s plodovima mora', '', '', '12.00'),
      item('Vegetarian Risotto', 'Vegetarijanski rizoto', '', '', '10.00'),
      item('Risotto with Chicken', 'Rizoto s piletinom', 'Bolognese, mushrooms or vegetarian', 'Bolognese, gljive ili vegetarijanski', '12.00'),
    ],
  },
  {
    id: 'sides',
    title: { en: 'Sides', hr: 'Prilozi' },
    tagline: { en: 'Perfect additions', hr: 'Savrseni dodaci' },
    items: [
      item('French Fries', 'Pomfrit', '', '', '3.00'),
      item('Wedges / Baked Potatoes', 'Wedges / peceni krumpir', '', '', '4.50'),
      item('Grilled Vegetables', 'Povrce na zaru', '', '', '6.00'),
      item('Flatbread', 'Lepinja', '', '', '2.00'),
      item('Ketchup', 'Ketchup', '', '', '1.00'),
      item('Mayonnaise', 'Majoneza', '', '', '1.00'),
      item('Mustard', 'Senf', '', '', '1.00'),
      item('Pepperoni', 'Feferoni', '', '', '1.50'),
      item('Olives', 'Masline', '', '', '1.50'),
      item('Tomato', 'Rajcica', '', '', '2.00'),
      item('Artichokes', 'Articoke', '', '', '1.50'),
    ],
  },
  {
    id: 'drinks',
    title: { en: 'Drinks', hr: 'Pica' },
    tagline: { en: 'Cold drinks, coffee, beer and wine', hr: 'Hladna pica, kava, pivo i vino' },
    items: [
      item('Mineral Water 1.00L', 'Mineralna voda 1.00L', '', '', '3.50'),
      item('Coca Cola 0.25L', 'Coca Cola 0.25L', '', '', '3.50'),
      item('Fanta 0.25L', 'Fanta 0.25L', '', '', '3.50'),
      item('Cockta 0.25L', 'Cockta 0.25L', '', '', '3.50'),
      item('Schweppes 0.25L', 'Schweppes 0.25L', '', '', '3.50'),
      item('Ice Tea', 'Ledeni caj', '', '', '3.50'),
      item('Cedevita', 'Cedevita', '', '', '3.50'),
      item('Cappy Various Flavours', 'Cappy razni okusi', '', '', '3.50'),
      item('Red Bull', 'Red Bull', '', '', '5.00'),
      item('Sprite 0.25L', 'Sprite 0.25L', '', '', '3.50'),
      item('Tonic', 'Tonic', '', '', '3.50'),
      item('Hidra 0.50L', 'Hidra 0.50L', '', '', '3.50'),
      item('Espresso', 'Espresso', '', '', '2.00'),
      item('Big Macchiato', 'Veliki macchiato', '', '', '3.00'),
      item('Small Macchiato', 'Mali macchiato', '', '', '2.50'),
      item('Cappuccino', 'Cappuccino', '', '', '2.50'),
      item('Latte', 'Latte', '', '', '3.00'),
      item('Caramel Latte', 'Caramel latte', '', '', '3.50'),
      item('Ice Coffee', 'Ledena kava', '', '', '2.50'),
      item('Chocolate Latte', 'Chocolate latte', '', '', '3.50'),
      item('Nescafe', 'Nescafe', '', '', '2.00'),
      item('Ozujsko Draught 0.30L', 'Ozujsko toceno 0.30L', '', '', '3.50'),
      item('Ozujsko Draught 0.50L', 'Ozujsko toceno 0.50L', '', '', '4.50'),
      item('Ozujsko Bottle 0.50L', 'Ozujsko boca 0.50L', '', '', '4.50'),
      item('Ozujsko Non-Alcoholic 0.50L', 'Ozujsko bezalkoholno 0.50L', '', '', '4.50'),
      item('Staropramen 0.50L', 'Staropramen 0.50L', '', '', '4.50'),
      item('Stella Artois 0.33L', 'Stella Artois 0.33L', '', '', '5.00'),
      item('Becks 0.33L', 'Becks 0.33L', '', '', '4.00'),
      item('Tomislav Black 0.50L', 'Tomislav crno 0.50L', '', '', '5.00'),
      item('Wines', 'Vina', 'Bottle price from menu', 'Cijena boce iz menija', '30.00 - 60.00'),
      item('Spirits', 'Zestoka pica', '0.03L', '0.03L', '2.50 - 5.00'),
    ],
  },
]

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
  return price.includes('-') ? `EUR ${price}` : `EUR ${Number(price).toFixed(2)}`
}
