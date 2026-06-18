export default function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://palma5.com'
  const routes = ['', '/menu', '/booking', '/booking/table', '/booking/room', '/contact']

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }))
}
