// ============================================================
// MintPrompt — /admin/prompts/new
// ============================================================

import Link from 'next/link'
import type { Metadata } from 'next'
import { adminFetchCategories } from '@/lib/admin/data'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { PromptFormClient } from '@/components/admin/PromptFormClient'

export const metadata: Metadata = { title: 'Upload New Prompt' }
export const dynamic = 'force-dynamic'

export default async function NewPromptPage() {
  const categories = await adminFetchCategories()

  return (
    <>
      <AdminTopbar title="Upload New Prompt">
        <Link href="/admin/prompts" className="btn btn-ghost btn-sm">← Back</Link>
      </AdminTopbar>
      <div className="admin-content">
        <PromptFormClient categories={categories} />
      </div>
    </>
  )
}
