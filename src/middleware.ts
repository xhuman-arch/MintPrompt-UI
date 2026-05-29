// ============================================================
// MintPrompt — Middleware (DEMO MODE)
// Admin routes are accessible without authentication in the
// public showcase. In production, restore the Supabase auth
// middleware from the original middleware.ts.bak file.
// ============================================================

import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Demo mode: allow all requests through without auth checks.
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
