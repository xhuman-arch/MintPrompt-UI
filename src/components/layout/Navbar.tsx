'use client'

// ============================================================
// MintPrompt — Navbar
// Sticky navigation with search and hidden admin trigger.
// ============================================================

import { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  search: string
  onSearchChange: (val: string) => void
}

export function Navbar({ search, onSearchChange }: NavbarProps) {
  const router = useRouter()
  const adminClicksRef = useRef(0)
  const adminTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hidden admin trigger: click logo 5 times within 5 seconds
  const handleLogoClick = useCallback(() => {
    adminClicksRef.current += 1

    if (adminTimerRef.current) clearTimeout(adminTimerRef.current)
    adminTimerRef.current = setTimeout(() => {
      adminClicksRef.current = 0
    }, 5000)

    if (adminClicksRef.current >= 5) {
      adminClicksRef.current = 0
      router.push('/admin/login')
    }
  }, [router])

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <button className="logo" onClick={handleLogoClick} aria-label="MintPrompt home">
        <div className="logo-dot" aria-hidden="true" />
        MintPrompt
      </button>

      <div className="search-wrap">
        <SearchIcon />
        <input
          type="search"
          className="search-input"
          placeholder="Search prompts, aesthetics…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search prompts"
        />
      </div>

      <div className="nav-right">
        <button className="nav-btn" aria-label="Explore">Explore</button>
        <button className="nav-btn nav-btn-primary">Get Prompts</button>
      </div>
    </nav>
  )
}

function SearchIcon() {
  return (
    <svg
      className="search-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}
