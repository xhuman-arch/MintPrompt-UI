// ============================================================
// MintPrompt — Supabase barrel export (CLIENT-SAFE ONLY)
//
// ⚠️  This barrel intentionally does NOT re-export server.ts.
//
// For server.ts utilities, import directly:
//   import { getSupabaseServerClient } from '@/lib/supabase/server'
//   import { getSupabaseAdminClient } from '@/lib/supabase/server'
//
// This barrel only exports browser-safe utilities.
// ============================================================

export { getSupabaseBrowserClient, supabase } from './client'
export { getStorageUrl, getOptimizedImageUrl, extractStoragePath, BUCKETS } from './storage'
export type { Database } from './types'
