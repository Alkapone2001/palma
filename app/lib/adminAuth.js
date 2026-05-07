export const ADMIN_COOKIE = 'palma_admin_session'

const DEV_ADMIN_PASSWORD = 'palma5admin'
const DEV_ADMIN_TOKEN = 'palma5-local-admin'

export function getAdminPassword() {
  if (process.env.PALMA_ADMIN_PASSWORD) {
    return process.env.PALMA_ADMIN_PASSWORD
  }

  return process.env.NODE_ENV === 'production' ? '' : DEV_ADMIN_PASSWORD
}

export function getAdminToken() {
  if (process.env.PALMA_ADMIN_SESSION_TOKEN) {
    return process.env.PALMA_ADMIN_SESSION_TOKEN
  }

  return process.env.NODE_ENV === 'production' ? '' : DEV_ADMIN_TOKEN
}

export function isAdminRequest(request) {
  return request.cookies.get(ADMIN_COOKIE)?.value === getAdminToken()
}

export function unauthorized() {
  return Response.json({ error: 'Admin login required' }, { status: 401 })
}
