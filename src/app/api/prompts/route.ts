// ============================================================
// MintPrompt — GET /api/prompts (DEMO MODE)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { fetchPromptsPublic } from '@/lib/api/prompts.public'
import type { AIModel } from '@/types/database'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const category = searchParams.get('category') ?? undefined
    const aiModel = (searchParams.get('aiModel') as AIModel | null) ?? undefined
    const search = searchParams.get('search') ?? undefined
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 50)

    const result = await fetchPromptsPublic({ category, aiModel, search, page, limit })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
