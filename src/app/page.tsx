// ============================================================
// MintPrompt — Homepage (Server Component)
// Fetches initial data server-side for fast first paint,
// then hands off to the client component for interactivity.
// ============================================================

import type { Metadata } from 'next'
import { HomeClient } from './HomeClient'
import { fetchPromptsPublic, fetchHeroStatsPublic } from '@/lib/api/prompts.public'
import { fetchCategoriesPublic } from '@/lib/api/categories.public'

export const metadata: Metadata = {
  title: 'MintPrompt — AI Aesthetic Prompt Discovery',
  description:
    'Browse thousands of curated AI image prompts for ChatGPT, Gemini, Grok, Midjourney & Flux. Copy prompts, discover aesthetics, shop inspired looks.',
  openGraph: {
    title: 'MintPrompt — AI Aesthetic Prompt Discovery',
    description: 'Copy curated AI prompts. Discover aesthetic visuals. Shop inspired looks.',
    type: 'website',
    locale: 'en_US',
    siteName: 'MintPrompt',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MintPrompt',
    description: 'Premium AI prompt gallery for Gen Z aesthetics.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function HomePage() {
  // Parallel server-side fetches
  const [promptsResult, categories, heroStats] = await Promise.all([
    fetchPromptsPublic({ page: 1, limit: 20 }),
    fetchCategoriesPublic(),
    fetchHeroStatsPublic(),
  ])

  return (
    <HomeClient
      initialPrompts={promptsResult.data}
      initialCount={promptsResult.count}
      initialCategories={categories}
      heroStats={heroStats}
    />
  )
}
