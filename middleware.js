import { NextResponse } from 'next/server'

const ADMIN_COOKIE = 'palma_admin_session'
const DEV_ADMIN_TOKEN = 'palma5-local-admin'

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next()
  }

  const adminToken = process.env.PALMA_ADMIN_SESSION_TOKEN || (process.env.NODE_ENV === 'production' ? '' : DEV_ADMIN_TOKEN)
  const hasSession = request.cookies.get(ADMIN_COOKIE)?.value === adminToken

  if (hasSession) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/admin/login'
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
