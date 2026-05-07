import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Palma Restaurant</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/booking" className="text-gray-700 hover:text-gray-900">Book Now</Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Palma Restaurant</h2>
          <p className="text-gray-600 mb-6">Experience fine dining with our exquisite menu and elegant atmosphere.</p>
          <Link href="/booking" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Book a Table or Room
          </Link>
        </div>
      </main>
    </div>
  )
}