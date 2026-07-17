import Link from 'next/link'
import { Clock, Instagram, MapPin, Star } from 'lucide-react'
import { reviewUrl } from './lib/links'
import './globals.css'

export const metadata = {
  title: 'Palma 5',
  description: 'A warm restaurant for seasonal dining, table reservations, and hotel room bookings.',
  openGraph: {
    title: 'Palma 5',
    description: 'Restaurant, pizzeria, bar, and rooms in Porec, Croatia.',
    type: 'website',
  },
}

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': ['Restaurant', 'LodgingBusiness'],
  name: 'Palma 5',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Spadici 54',
    postalCode: '52440',
    addressLocality: 'Porec',
    addressCountry: 'HR',
  },
  servesCuisine: ['Pizza', 'Seafood', 'Grill', 'Pasta', 'Croatian'],
  sameAs: ['https://www.instagram.com/pizzeria.palma5'],
  hasMenu: '/menu',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 bg-white px-4 py-14 text-stone-700 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <Link href="/" className="text-2xl font-semibold text-stone-950">Palma 5</Link>
              <p className="mt-4 max-w-md leading-7 text-stone-600">
                Seasonal plates, comfortable rooms, and thoughtful hospitality for dinner, overnight stays, and the nights you want to remember.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-950">Visit</h2>
              <div className="mt-5 space-y-3 text-sm">
                <a href="https://www.google.com/maps/search/?api=1&query=Spadici%2054%2C%2052440%2C%20Porec%2C%20Croatia" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-emerald-900">
                  <MapPin className="h-4 w-4 text-emerald-800" />Spadici 54, 52440, Porec, Croatia
                </a>
                <a href="https://www.instagram.com/pizzeria.palma5?igsh=MWs4aHVtd201ZHR4cQ==" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-emerald-900">
                  <Instagram className="h-4 w-4 text-emerald-800" />@pizzeria.palma5
                </a>
                <a href={reviewUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-emerald-900">
                  <Star className="h-4 w-4 text-emerald-800" />Leave a review
                </a>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-950">Hours</h2>
              <div className="mt-5 space-y-3 text-sm">
                <p className="flex items-center gap-3"><Clock className="h-4 w-4 text-emerald-800" />Every day: 08:00 - 00:00</p>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-stone-200 pt-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 Palma 5. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
