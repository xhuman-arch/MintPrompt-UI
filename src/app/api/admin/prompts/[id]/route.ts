// ============================================================
// MintPrompt — ADMIN API (DEMO MODE)
// All admin write operations are disabled in the public showcase.
// ============================================================

import { NextResponse } from 'next/server'

const DEMO = { message: "Demo mode: Admin API disabled. Connect a real Supabase project to enable admin features." }

export async function GET() { return NextResponse.json(DEMO) }
export async function POST() { return NextResponse.json(DEMO, { status: 403 }) }
export async function PUT() { return NextResponse.json(DEMO, { status: 403 }) }
export async function DELETE() { return NextResponse.json(DEMO, { status: 403 }) }
export async function PATCH() { return NextResponse.json(DEMO, { status: 403 }) }

