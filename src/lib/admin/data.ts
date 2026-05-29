// ============================================================
// MintPrompt — Admin Data API (DEMO MODE)
// All reads return mock data. All writes are no-ops.
// ============================================================

import { MOCK_PROMPTS, MOCK_HERO_STATS } from '../../../mock/prompts'
import { MOCK_CATEGORIES } from '../../../mock/categories'
import type { Prompt, Category, AffiliateLink } from '@/types/database'

export interface AdminPromptsQuery {
  search?: string
  category?: string
  published?: boolean | 'all'
  page?: number
}

const PAGE_SIZE = 20

export async function adminFetchPrompts(query: AdminPromptsQuery = {}) {
  const { search, published = 'all', page = 1 } = query
  let data = [...MOCK_PROMPTS]
  if (published !== 'all') data = data.filter((p) => p.published === published)
  if (search?.trim()) data = data.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
  const from = (page - 1) * PAGE_SIZE
  return { data: data.slice(from, from + PAGE_SIZE) as Prompt[], count: data.length, page, hasMore: false }
}

export async function adminFetchPromptById(id: string): Promise<Prompt | null> {
  return MOCK_PROMPTS.find((p) => p.id === id) ?? null
}

export interface UpsertPromptPayload {
  id?: string
  title: string
  slug?: string
  [key: string]: unknown
}

/** No-op in demo mode */
export async function adminUpsertPrompt(payload: UpsertPromptPayload): Promise<Prompt> {
  console.info('[Demo] adminUpsertPrompt called — no-op', payload.title)
  return MOCK_PROMPTS[0]
}

/** No-op in demo mode */
export async function adminDeletePrompt(_id: string): Promise<void> {
  console.info('[Demo] adminDeletePrompt called — no-op')
}

/** No-op in demo mode */
export async function adminPublishPrompt(_id: string, _published: boolean): Promise<void> {
  console.info('[Demo] adminPublishPrompt called — no-op')
}

export async function adminFetchCategories(): Promise<Category[]> {
  return MOCK_CATEGORIES
}

/** No-op in demo mode */
export async function adminUpsertCategory(payload: Partial<Category>): Promise<Category> {
  console.info('[Demo] adminUpsertCategory called — no-op', payload.name)
  return MOCK_CATEGORIES[0]
}

/** No-op in demo mode */
export async function adminDeleteCategory(_id: string): Promise<void> {
  console.info('[Demo] adminDeleteCategory called — no-op')
}

/** No-op in demo mode */
export async function adminUpsertAffiliateLink(payload: Partial<AffiliateLink>): Promise<AffiliateLink> {
  console.info('[Demo] adminUpsertAffiliateLink called — no-op', payload.product_name)
  return MOCK_PROMPTS[0].affiliate_links![0]
}

/** No-op in demo mode */
export async function adminDeleteAffiliateLink(_id: string): Promise<void> {
  console.info('[Demo] adminDeleteAffiliateLink called — no-op')
}

export interface AnalyticsData {
  totalViews: number
  totalLikes: number
  totalCopies: number
  totalAffiliateClicks: number
  modelCopies: Record<string, number>
  topPrompts: Array<{ id: string; title: string; views: number; likes: number }>
}

export async function adminFetchAnalytics(): Promise<AnalyticsData> {
  return {
    totalViews: MOCK_HERO_STATS.totalViews,
    totalLikes: MOCK_PROMPTS.reduce((s, p) => s + p.likes, 0),
    totalCopies: MOCK_HERO_STATS.totalCopies,
    totalAffiliateClicks: 842,
    modelCopies: { chatgpt: 1240, gemini: 830, grok: 390 },
    topPrompts: MOCK_PROMPTS.slice(0, 5).map((p) => ({ id: p.id, title: p.title, views: p.views, likes: p.likes })),
  }
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function adminFetchAffiliateLinks(promptId: string): Promise<AffiliateLink[]> {
  const prompt = MOCK_PROMPTS.find((p) => p.id === promptId)
  return prompt?.affiliate_links ?? []
}
