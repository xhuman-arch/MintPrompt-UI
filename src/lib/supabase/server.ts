// ============================================================
// MintPrompt — Supabase Server Barrel (DEMO MODE STUB)
// ============================================================

export { getSupabaseAuthClient as getSupabaseServerClient } from './server-auth'

export function getSupabaseAdminClient() {
  throw new Error('[MintPrompt] Demo mode: Admin client not available. SUPABASE_SERVICE_ROLE_KEY is not set.')
}
