// ============================================================
// MintPrompt — GET /api/categories (DEMO MODE)
// ============================================================

import { NextResponse } from 'next/server'
import { fetchCategoriesPublic } from '@/lib/api/categories.public'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await fetchCategoriesPublic()
    return NextResponse.json(categories)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
