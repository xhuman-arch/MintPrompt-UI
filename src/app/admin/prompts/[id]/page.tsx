// ============================================================
// MintPrompt — /admin/prompts/[id]
// ============================================================

import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { adminFetchPromptById, adminFetchCategories, adminFetchAffiliateLinks } from '@/lib/admin/data'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { PromptFormClient } from '@/components/admin/PromptFormClient'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const prompt = await adminFetchPromptById(id)
  return { title: prompt ? `Edit: ${prompt.title}` : 'Prompt Not Found' }
}

export default async function EditPromptPage({ params }: Props) {
  const { id } = await params
  const [prompt, categories, affiliateLinks] = await Promise.all([
    adminFetchPromptById(id),
    adminFetchCategories(),
    adminFetchAffiliateLinks(id),
  ])

  if (!prompt) notFound()

  return (
    <>
      <AdminTopbar title={`Edit: ${prompt.title}`}>
        <a href={`/prompt/${prompt.slug}`} target="_blank" className="btn btn-ghost btn-sm">
          View Live ↗
        </a>
        <Link href="/admin/prompts" className="btn btn-ghost btn-sm">← Back</Link>
      </AdminTopbar>
      <div className="admin-content">
        <PromptFormClient prompt={prompt} categories={categories} affiliateLinks={affiliateLinks} />
      </div>
    </>
  )
}
