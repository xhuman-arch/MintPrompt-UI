'use client'

// ============================================================
// MintPrompt — /admin/login (DEMO MODE)
// Authentication is bypassed in the public showcase.
// Click "Enter Demo" to access the admin dashboard.
// ============================================================

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '@/styles/admin.css'

function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleDemo(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/admin/dashboard'), 600)
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#c8ff57', boxShadow: '0 0 10px #c8ff57',
            display: 'inline-block', flexShrink: 0,
          }} />
          MintPrompt
        </div>

        <h1 className="admin-login-heading">Admin Login</h1>

        {/* Demo mode banner */}
        <div className="form-feedback" style={{
          background: 'rgba(200,255,87,0.08)',
          border: '1px solid rgba(200,255,87,0.3)',
          color: '#c8ff57',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 13,
          marginBottom: 16,
        }}>
          🎭 <strong>Demo Mode</strong> — Authentication is disabled in the public showcase.
          Click below to explore the admin interface with mock data.
        </div>

        <form onSubmit={handleDemo}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '11px 16px' }}
            disabled={loading}
          >
            {loading ? 'Loading demo…' : 'Enter Demo Admin →'}
          </button>
        </form>

        <hr className="admin-login-divider" />
        <div className="admin-login-footer">
          <Link href="/">← Back to Gallery</Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-loading">
            <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
