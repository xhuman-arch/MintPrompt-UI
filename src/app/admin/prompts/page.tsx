// ============================================================
// MintPrompt — Admin Prompts List
// ============================================================

import Link from 'next/link'
import type { Metadata } from 'next'
import { adminFetchPrompts } from '@/lib/admin/data'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { PromptsTableClient } from '@/components/admin/PromptsTableClient'

export const metadata: Metadata = { title: 'Prompts' }
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ search?: string; page?: string; published?: string }>
}

export default async function AdminPromptsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1', 10)
  const published = params.published === 'draft' ? false
    : params.published === 'published' ? true : 'all'

  const { data: prompts, count, hasMore } = await adminFetchPrompts({
    search: params.search,
    published,
    page,
  })

  return (
    <>
      <AdminTopbar title={`Prompts (${count})`}>
        <Link href="/admin/prompts/new" className="btn btn-primary btn-sm">+ Upload New</Link>
      </AdminTopbar>

      <div className="admin-content">
        <PromptsTableClient
          prompts={prompts}
          count={count}
          page={page}
          hasMore={hasMore}
          searchDefault={params.search ?? ''}
          publishedFilter={params.published ?? 'all'}
        />
      </div>
    </>
  )
}
