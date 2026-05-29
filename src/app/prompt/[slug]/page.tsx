// ============================================================
// MintPrompt — /prompt/[slug]
// SEO-optimised server-rendered prompt detail page.
//
// generateStaticParams + generateMetadata use prompts.public.ts
// (no cookies, safe at build time).
//
// The page body also uses public fetchers — these are public
// routes, no auth needed. Admin routes use server-auth.ts.
// ============================================================

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HomeClient } from '@/app/HomeClient'
import {
  fetchPromptsPublic,
  fetchPromptBySlugPublic,
} from '@/lib/api/prompts.public'
import { fetchCategoriesPublic } from '@/lib/api/categories.public'
import { fetchHeroStatsPublic } from '@/lib/api/prompts.public'
import { getStorageUrl } from '@/lib/supabase/storage'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 300 // 5 minutes ISR

// ─────────────────────────────────────────────────────────────
// generateStaticParams — runs at BUILD TIME, no HTTP request.
// MUST use public client (no cookies).
// ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const { data } = await fetchPromptsPublic({ limit: 50 })
  return data.map((p) => ({ slug: p.slug }))
}

// ─────────────────────────────────────────────────────────────
// generateMetadata — also runs without a request context.
// MUST use public client (no cookies).
// ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prompt = await fetchPromptBySlugPublic(slug)
  if (!prompt) return { title: 'Prompt not found — MintPrompt' }

  const imageUrl = getStorageUrl(prompt.image_url) ?? undefined
  const models = prompt.ai_models.join(', ')

  return {
    title: `${prompt.title} — MintPrompt`,
    description:
      prompt.description ??
      `Copy the "${prompt.title}" AI image prompt optimised for ${models}. Discover more aesthetics on MintPrompt.`,
    openGraph: {
      title: `${prompt.title} — MintPrompt`,
      description: prompt.description ?? '',
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: prompt.title,
      description: prompt.description ?? '',
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: { canonical: `/prompt/${slug}` },
  }
}

// ─────────────────────────────────────────────────────────────
// Page — runs per-request (ISR). Public routes use public client.
// ─────────────────────────────────────────────────────────────
export default async function PromptPage({ params }: Props) {
  const { slug } = await params

  // Verify prompt exists (returns 404 if not)
  const prompt = await fetchPromptBySlugPublic(slug)
  if (!prompt) notFound()

  // Load gallery + hero data in parallel — all public, no auth needed
  const [promptsResult, categories, heroStats] = await Promise.all([
    fetchPromptsPublic({ page: 1, limit: 20 }),
    fetchCategoriesPublic(),
    fetchHeroStatsPublic(),
  ])

  // HomeClient opens the detail panel automatically for this slug
  return (
    <HomeClient
      initialPrompts={promptsResult.data}
      initialCount={promptsResult.count}
      initialCategories={categories}
      heroStats={heroStats}
      initialOpenSlug={slug}
    />
  )
}
