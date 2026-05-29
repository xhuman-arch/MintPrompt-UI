// ============================================================
// MintPrompt — Prompt Fetching (DEMO / MOCK MODE)
// All data is served from local mock files. No Supabase needed.
// ============================================================

import { MOCK_PROMPTS, MOCK_HERO_STATS } from '../../../mock/prompts'
import type { Prompt, PromptsQuery, PromptsResponse } from '@/types/database'

export interface HeroStats {
  totalPrompts: number
  totalViews: number
  totalCopies: number
}

const DEFAULT_LIMIT = 20

export async function fetchPromptsPublic(query: PromptsQuery = {}): Promise<PromptsResponse> {
  const { category, aiModel, search, page = 1, limit = DEFAULT_LIMIT } = query

  let filtered = MOCK_PROMPTS.filter((p) => p.published)

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category?.slug === category)
  }
  if (aiModel && aiModel !== 'all') {
    filtered = filtered.filter((p) => p.ai_models.includes(aiModel as 'chatgpt' | 'gemini' | 'grok' | 'flux' | 'mj'))
  }
  if (search?.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q)
    )
  }

  const count = filtered.length
  const from = (page - 1) * limit
  const data = filtered.slice(from, from + limit)

  return { data, count, page, limit, hasMore: from + limit < count }
}

export async function fetchPromptBySlugPublic(slug: string): Promise<Prompt | null> {
  return MOCK_PROMPTS.find((p) => p.slug === slug && p.published) ?? null
}

export async function fetchHeroStatsPublic(): Promise<HeroStats> {
  return MOCK_HERO_STATS
}
