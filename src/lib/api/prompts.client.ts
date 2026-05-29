// ============================================================
// MintPrompt — Prompt Fetching (BROWSER / DEMO MODE)
// Uses local mock data — no Supabase client required.
// ============================================================

import { MOCK_PROMPTS } from '../../../mock/prompts'
import type { Prompt, PromptsQuery, PromptsResponse, AIModel } from '@/types/database'

const DEFAULT_LIMIT = 20

export async function fetchPrompts(query: PromptsQuery = {}): Promise<PromptsResponse> {
  const { category, aiModel, search, page = 1, limit = DEFAULT_LIMIT } = query

  let filtered = MOCK_PROMPTS.filter((p) => p.published)

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category?.slug === category)
  }
  if (aiModel && aiModel !== 'all') {
    filtered = filtered.filter((p) => p.ai_models.includes(aiModel as AIModel))
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

  // Simulate slight network latency for realism
  await new Promise((r) => setTimeout(r, 120))

  return { data, count, page, limit, hasMore: from + limit < count }
}

export async function fetchPromptBySlug(slug: string): Promise<Prompt | null> {
  await new Promise((r) => setTimeout(r, 80))
  return MOCK_PROMPTS.find((p) => p.slug === slug && p.published) ?? null
}

export async function fetchRelatedPrompts(
  promptId: string,
  categoryId: string | null,
  _aiModels: AIModel[],
  limit = 6
): Promise<Prompt[]> {
  let related = MOCK_PROMPTS.filter((p) => p.published && p.id !== promptId)
  if (categoryId) {
    related = related.filter((p) => p.category_id === categoryId)
  }
  return related.slice(0, limit)
}
