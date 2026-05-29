// ============================================================
// MintPrompt — lib/api/categories.ts (CLIENT-SAFE ONLY)
//
// ⚠️  This file only re-exports browser-safe functions.
//
// Server-only functions must be imported directly from:
//   '@/lib/api/categories.server'
//
// DO NOT re-export server functions here — any client component
// importing from '@/lib/api/categories' would pull next/headers
// into the browser bundle.
// ============================================================

export { fetchCategories } from './categories.client'
