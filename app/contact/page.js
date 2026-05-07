import Link from 'next/link'

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">Palma Restaurant</Link>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600 mb-4">Get in touch with us for reservations or inquiries.</p>
            <div className="space-y-4">
              <p><strong>Address:</strong> 123 Restaurant St, City, State 12345</p>
              <p><strong>Phone:</strong> (123) 456-7890</p>
              <p><strong>Email:</strong> info@palma.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}