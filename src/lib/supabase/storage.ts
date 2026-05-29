// ============================================================
// MintPrompt — Storage Utilities (DEMO MODE)
// Returns null for all storage paths since there is no real
// Supabase project in the showcase. Prompts fall back to
// gradient + emoji placeholders.
// ============================================================

export const BUCKETS = {
  PROMPT_IMAGES: 'prompt-images',
  PRODUCT_IMAGES: 'product-images',
} as const

export function getStorageUrl(_path: string | null | undefined, _bucket?: string): string | null {
  return null
}

export function getOptimizedImageUrl(_path: string | null | undefined, _options?: object): string | null {
  return null
}

export function extractStoragePath(_fullUrl: string, _bucket: string): string | null {
  return null
}
