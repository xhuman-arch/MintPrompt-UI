// ============================================================
// MintPrompt — API barrel export (CLIENT-SAFE ONLY)
//
// ⚠️  This barrel exports ONLY browser-safe functions.
//
// Server-only functions must be imported directly:
//   import { fetchPromptsServer } from '@/lib/api/prompts.server'
//   import { fetchCategoriesServer } from '@/lib/api/categories.server'
//   import { fetchHeroStats } from '@/lib/api/prompts.server'
//
// Re-exporting server functions here would pull next/headers into
// any client component that imports from '@/lib/api', causing the
// "You're importing a module that depends on next/headers" error.
// ============================================================

// Browser-safe exports (no next/headers, no cookies)
export { fetchPrompts, fetchPromptBySlug, fetchRelatedPrompts } from './prompts.client'
export { fetchCategories } from './categories.client'
