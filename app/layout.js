import './globals.css'

export const metadata = {
  title: 'Palma Restaurant',
  description: 'Book your table or room at Palma Restaurant',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {children}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Palma Restaurant</h3>
                <p className="text-gray-300">Experience the best in fine dining.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-300">123 Restaurant St, City, State 12345</p>
                <p className="text-gray-300">(123) 456-7890</p>
                <p className="text-gray-300">info@palma.com</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Hours</h3>
                <p className="text-gray-300">Mon-Fri: 11am - 10pm</p>
                <p className="text-gray-300">Sat-Sun: 12pm - 11pm</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center">
              <p className="text-gray-300">&copy; 2026 Palma Restaurant. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}