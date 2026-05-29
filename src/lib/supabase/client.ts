// ============================================================
// MintPrompt — Supabase Browser Client (DEMO MODE STUB)
// The public showcase does not use a real Supabase connection.
// This stub prevents import errors. Connect to a real Supabase
// project by filling in .env.local from .env.example.
// ============================================================

// No-op stubs — the demo version doesn't call Supabase from the browser.
export function getSupabaseBrowserClient() {
  throw new Error('[MintPrompt] Demo mode: Supabase browser client not available. The showcase uses mock data.')
}

export const supabase = getSupabaseBrowserClient
