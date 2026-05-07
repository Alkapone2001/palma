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
              <Link href="/menu" className="text-gray-700 hover:text-gray-900">Menu</Link>
              <Link href="/booking" className="text-gray-700 hover:text-gray-900">Book Now</Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Palma Restaurant</h1>
              <p className="text-xl md:text-2xl mb-8">Experience fine dining with our exquisite menu and elegant atmosphere</p>
              <Link href="/booking" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
                Book a Table or Room
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Fine Dining</h3>
              <p className="text-gray-600">Enjoy our carefully crafted dishes made with the finest ingredients.</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Private Rooms</h3>
              <p className="text-gray-600">Book private rooms for special occasions and events.</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Reservations</h3>
              <p className="text-gray-600">Easy online booking for tables and rooms.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}