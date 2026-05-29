// ============================================================
// MintPrompt — 404 Not Found
// ============================================================

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-glow" aria-hidden="true" />
      <h1 className="not-found-code">404</h1>
      <p className="not-found-title">Prompt not found</p>
      <p className="not-found-sub">
        This prompt may have been removed or the link is broken.
      </p>
      <Link href="/" className="not-found-btn">
        ← Back to Gallery
      </Link>
    </div>
  )
}
