import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, getAdminPassword, getAdminToken } from '../../../lib/adminAuth'

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const adminPassword = getAdminPassword()

  if (!adminPassword) {
    return NextResponse.json({ error: 'Admin password is not configured' }, { status: 500 })
  }

  if (body.password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ message: 'Logged in' })
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: getAdminToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })

  return response
}
