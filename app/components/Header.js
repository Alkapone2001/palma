import Link from 'next/link'
import { Star } from 'lucide-react'
import { reviewUrl } from '../lib/links'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/booking', label: 'Book' },
  { href: '/contact', label: 'Contact' },
]

export default function Header({ theme = 'light' }) {
  const isDark = theme === 'dark'

  return (
    <header className={`absolute inset-x-0 top-0 z-20 ${isDark ? 'text-white' : 'text-stone-950'}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-full border text-lg font-semibold ${isDark ? 'border-white/30 bg-white/10' : 'border-stone-200 bg-white'}`}>
            P
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-wide">Palma 5</span>
            <span className={`block text-xs uppercase ${isDark ? 'text-white/70' : 'text-stone-500'}`}>Restaurant and rooms</span>
          </span>
        </Link>

        <nav className={`hidden items-center gap-1 rounded-full border p-1 text-sm font-medium shadow-sm backdrop-blur md:flex ${isDark ? 'border-white/20 bg-black/25' : 'border-stone-200 bg-white/85'}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 transition ${isDark ? 'text-white/80 hover:bg-white/15 hover:text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold shadow-sm transition sm:px-4 ${isDark ? 'border border-amber-200/50 bg-amber-200 text-stone-950 hover:bg-amber-100' : 'border border-amber-200 bg-amber-100 text-stone-950 hover:bg-amber-200'}`}
          >
            <Star className="h-4 w-4" />
            <span className="sm:hidden">Review</span>
            <span className="hidden sm:inline">Leave a review</span>
          </a>
          <Link
            href="/booking"
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${isDark ? 'bg-white text-stone-950 hover:bg-stone-100' : 'bg-emerald-900 text-white hover:bg-emerald-800'}`}
          >
            Reserve
          </Link>
        </div>
      </div>
    </header>
  )
}
