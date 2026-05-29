'use client'

// ============================================================
// MintPrompt — Footer
// Hidden admin trigger: click copyright text 5× in 5 seconds.
// ============================================================

import { useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function Footer() {
  const router = useRouter()
  const clicksRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopyrightClick = useCallback(() => {
    clicksRef.current += 1
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => { clicksRef.current = 0 }, 5000)

    if (clicksRef.current >= 5) {
      clicksRef.current = 0
      router.push('/admin/login')
    }
  }, [router])

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-logo">
          <span className="logo-dot-sm" aria-hidden="true" />
          MintPrompt
        </div>
        <p className="footer-tagline">Premium AI Aesthetic Prompt Discovery</p>
        <div className="footer-links" role="list">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="footer-link" role="listitem">
              {l.label}
            </a>
          ))}
        </div>
        {/* Hidden admin trigger — clicking 5× in 5s navigates to /admin/login */}
        <button
          className="footer-copyright"
          onClick={handleCopyrightClick}
          aria-label="Copyright"
        >
          © {new Date().getFullYear()} MintPrompt. All rights reserved.
        </button>
      </div>
    </footer>
  )
}

const LINKS = [
  { label: 'Explore',  href: '#' },
  { label: 'Trending', href: '#' },
  { label: 'About',    href: '#' },
  { label: 'Contact',  href: '#' },
]
