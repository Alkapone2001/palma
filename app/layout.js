import './globals.css'

export const metadata = {
  title: 'Palma Restaurant',
  description: 'Book your table or room at Palma Restaurant',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}