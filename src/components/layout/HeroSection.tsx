// ============================================================
// MintPrompt — HeroSection (Client Display Component)
// Receives pre-fetched stats as props from the Server Component.
// No server imports — safe to use inside 'use client' trees.
// ============================================================

'use client'

// HeroStats is defined in prompts.public.ts (the single source of truth)
// and re-exported here for consumers that import from this component.
export type { HeroStats } from '@/lib/api/prompts.public'
import type { HeroStats } from '@/lib/api/prompts.public'

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

interface HeroSectionProps {
  stats: HeroStats
}

export function HeroSection({ stats }: HeroSectionProps) {
  const { totalPrompts, totalViews, totalCopies } = stats

  const statRows = [
    { value: totalPrompts > 0 ? fmt(totalPrompts) : '—', label: 'Prompts' },
    { value: totalCopies > 0 ? fmt(totalCopies) : '—', label: 'Copies' },
    { value: totalViews > 0 ? fmt(totalViews) : '—', label: 'Views' },
  ]

  return (
    <section className="hero" aria-label="Hero">
      <div className="hero-glow" aria-hidden="true" />
      <h1 className="hero-title">
        Discover <span className="hero-accent">AI Aesthetic</span>
        <br />Prompts
      </h1>
      <p className="hero-sub">
        Browse curated prompts for ChatGPT, Gemini, Grok &amp; more.
        <br />Copy, create, inspire.
      </p>
      <div className="stat-row" aria-label="Platform stats">
        {statRows.map((s, i) => (
          <div key={s.label} style={{ display: 'contents' }}>
            {i > 0 && <div className="stat-divider" aria-hidden="true" />}
            <div className="stat">
              <div className="stat-n">{s.value}</div>
              <div className="stat-l">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
