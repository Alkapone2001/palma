import Link from 'next/link'

export default function Menu() {
  const menuItems = [
    { name: 'Grilled Salmon', description: 'Fresh salmon with herbs and lemon', price: '$25' },
    { name: 'Beef Steak', description: 'Prime cut beef with garlic butter', price: '$30' },
    { name: 'Pasta Carbonara', description: 'Creamy pasta with pancetta and parmesan', price: '$18' },
    { name: 'Caesar Salad', description: 'Crisp romaine with caesar dressing', price: '$12' },
    { name: 'Chocolate Cake', description: 'Rich chocolate cake with vanilla ice cream', price: '$8' },
  ]

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
              <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
              <Link href="/menu" className="text-gray-700 hover:text-gray-900">Menu</Link>
              <Link href="/booking" className="text-gray-700 hover:text-gray-900">Book Now</Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <div key={index} className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="text-xl font-bold text-blue-600">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}