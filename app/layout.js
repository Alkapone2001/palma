import Link from 'next/link'
import { Clock, Instagram, MapPin } from 'lucide-react'
import './globals.css'

export const metadata = {
  title: 'Palma 5',
  description: 'A warm restaurant for seasonal dining, table reservations, and hotel room bookings.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
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
                <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-emerald-800" />Spadici 54, 52440, Porec, Croatia</p>
                <a href="https://www.instagram.com/pizzeria.palma5?igsh=MWs4aHVtd201ZHR4cQ==" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-emerald-900">
                  <Instagram className="h-4 w-4 text-emerald-800" />@pizzeria.palma5
                </a>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-950">Hours</h2>
              <div className="mt-5 space-y-3 text-sm">
                <p className="flex items-center gap-3"><Clock className="h-4 w-4 text-emerald-800" />Mon-Fri: 11am - 10pm</p>
                <p className="flex items-center gap-3"><Clock className="h-4 w-4 text-emerald-800" />Sat-Sun: 12pm - 11pm</p>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-stone-200 pt-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 Palma 5. All rights reserved.</p>
            <Link href="/admin" className="font-medium text-stone-700 hover:text-emerald-900">Admin</Link>
          </div>
        </footer>
      </body>
    </html>
  )
}
