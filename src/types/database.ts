// ============================================================
// MintPrompt — Database Types
// Auto-generated from schema — keep in sync with schema.sql
// ============================================================

export type AIModel = 'chatgpt' | 'gemini' | 'grok' | 'flux' | 'mj'
export type Affiliateplatform = 'shopee' | 'tiktok' | 'tokopedia' | 'lazada' | 'other'
export type AnalyticsEventType = 'view' | 'like' | 'copy' | 'affiliate_click'

// ─── Raw DB rows ─────────────────────────────────────────────

export interface DBCategory {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
}

export interface DBPrompt {
  id: string
  title: string
  slug: string
  image_url: string | null
  description: string | null
  category_id: string | null
  tags: string[]
  ai_models: AIModel[]
  prompt_chatgpt: string | null
  prompt_gemini: string | null
  prompt_grok: string | null
  negative_prompt: string | null
  views: number
  likes: number
  copy_count: number
  published: boolean
  created_at: string
  updated_at: string
  crop_x:      number | null
  crop_y:      number | null
  crop_width:  number | null
  crop_height: number | null
  crop_zoom:   number | null
  thumbnail_url: string | null
}

export interface DBAffiliateLink {
  id: string
  prompt_id: string
  product_name: string
  product_image: string | null
  affiliate_url: string
  platform: Affiliateplatform
  sort_order: number
  cta_label: string | null
  created_at: string
}

export interface DBAnalyticsEvent {
  id: number
  prompt_id: string | null
  event_type: AnalyticsEventType
  ai_model: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

// ─── Joined / enriched types used in the frontend ───────────

export type Category = DBCategory

export type AffiliateLink = DBAffiliateLink

export interface Prompt extends DBPrompt {
  category?: Category | null
  affiliate_links?: AffiliateLink[]
}

// ─── Query param shapes ──────────────────────────────────────

export interface PromptsQuery {
  category?: string
  aiModel?: AIModel | 'all'
  search?: string
  page?: number
  limit?: number
}

export interface PromptsResponse {
  data: Prompt[]
  count: number
  page: number
  limit: number
  hasMore: boolean
}

// ─── UI-layer types ──────────────────────────────────────────

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AppError {
  message: string
  code?: string
}
