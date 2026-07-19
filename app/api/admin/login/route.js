import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, getAdminPassword, getAdminToken, getAgencyPassword, getAgencyToken } from '../../../lib/adminAuth'

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const adminPassword = getAdminPassword()
  const agencyPassword = getAgencyPassword()

  if (!adminPassword && !agencyPassword) {
    return NextResponse.json({ error: 'Login password is not configured' }, { status: 500 })
  }

  const role = body.password === adminPassword
    ? 'admin'
    : body.password === agencyPassword
      ? 'agency'
      : ''

  if (!role) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({
    message: 'Logged in',
    role,
    nextPath: role === 'agency' ? '/admin/calendar' : body.nextPath || '/admin',
  })
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: role === 'agency' ? getAgencyToken() : getAdminToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })

  return response
}
