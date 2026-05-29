// ============================================================
// MintPrompt — lib/api/prompts.ts (CLIENT-SAFE ONLY)
//
// ⚠️  This file only re-exports browser-safe functions.
//
// Server-only functions must be imported directly from:
//   '@/lib/api/prompts.server'
//
// DO NOT re-export server functions here — any client component
// importing from '@/lib/api/prompts' would pull next/headers
// into the browser bundle.
// ============================================================

export { fetchPrompts, fetchPromptBySlug, fetchRelatedPrompts } from './prompts.client'
