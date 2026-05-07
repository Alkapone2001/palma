'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { LockKeyhole } from 'lucide-react'

export default function AdminLogin() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') || '/admin'
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (response.ok) {
      window.location.href = nextPath
      return
    }

    setStatus('error')
    setMessage('Wrong admin password.')
  }

  return (
    <LoginShell>
      <form onSubmit={handleSubmit}>
        <LoginHeader />

        <label className="mt-6 block text-sm font-semibold">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 block w-full rounded-lg border border-[#d8c8b8] px-3 py-3 outline-none focus:border-emerald-900"
            autoFocus
            required
          />
        </label>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="mt-6 w-full rounded-full bg-emerald-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'submitting' ? 'Signing in...' : 'Enter dashboard'}
        </button>
        {message && <p className="mt-4 text-sm font-semibold text-red-700">{message}</p>}
      </form>
    </LoginShell>
  )
}

function LoginShell({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ee] px-4 py-12 text-[#2f261f]">
      <div className="w-full max-w-md rounded-lg border border-[#e1d6ca] bg-white p-7 shadow-xl shadow-stone-200/70">
        {children || <LoginHeader />}
      </div>
    </main>
  )
}

function LoginHeader() {
  return (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
        <LockKeyhole className="h-5 w-5" />
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-800">Palma 5 admin</p>
      <h1 className="mt-3 text-3xl font-bold">Sign in</h1>
      <p className="mt-3 text-sm leading-6 text-[#69594d]">
        Reservations, room prices, table capacity, and approvals are protected behind this login.
      </p>
    </>
  )
}
