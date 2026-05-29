// ============================================================
// MintPrompt — Analytics (DEMO MODE)
// All tracking functions are no-ops in the public showcase.
// In production, connect to Supabase analytics_events table.
// ============================================================

import type { AnalyticsEventType, AIModel } from '@/types/database'

interface TrackOptions {
  promptId: string
  eventType: AnalyticsEventType
  aiModel?: AIModel | string
  metadata?: Record<string, unknown>
}

/** No-op in demo mode */
export async function trackEvent(_opts: TrackOptions): Promise<void> {
  // Demo mode: analytics disabled
}

/** No-op in demo mode */
export function trackView(_promptId: string): void {
  // Demo mode
}

/** No-op in demo mode */
export function trackCopy(_promptId: string, _aiModel: string): void {
  // Demo mode
}

/** No-op in demo mode */
export function trackLike(_promptId: string): void {
  // Demo mode
}

/** No-op in demo mode */
export function trackAffiliateClick(_promptId: string, _platform: string, _productName: string): void {
  // Demo mode
}

/** Always returns true in demo mode */
export function shouldRedirectAffiliate(): boolean {
  return true
}
