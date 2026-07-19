import { NextResponse } from 'next/server'

const ADMIN_COOKIE = 'palma_admin_session'
const DEV_ADMIN_TOKEN = 'palma5-local-admin'
const DEV_AGENCY_TOKEN = 'palma5-local-agency'

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next()
  }

  const adminToken = process.env.PALMA_ADMIN_SESSION_TOKEN || (process.env.NODE_ENV === 'production' ? '' : DEV_ADMIN_TOKEN)
  const agencyToken = process.env.PALMA_AGENCY_SESSION_TOKEN || (process.env.NODE_ENV === 'production' ? '' : DEV_AGENCY_TOKEN)
  const session = request.cookies.get(ADMIN_COOKIE)?.value
  const hasAdminSession = session === adminToken
  const hasAgencySession = session === agencyToken

  if (hasAdminSession) {
    return NextResponse.next()
  }

  if (hasAgencySession && pathname === '/admin/calendar') {
    return NextResponse.next()
  }

  if (hasAgencySession) {
    const calendarUrl = request.nextUrl.clone()
    calendarUrl.pathname = '/admin/calendar'
    calendarUrl.search = ''
    return NextResponse.redirect(calendarUrl)
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/admin/login'
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
