// ============================================================
// MintPrompt — /admin/categories
// ============================================================

import type { Metadata } from 'next'
import { adminFetchCategories } from '@/lib/admin/data'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { CategoriesClient } from '@/components/admin/CategoriesClient'

export const metadata: Metadata = { title: 'Categories' }
export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await adminFetchCategories()
  return (
    <>
      <AdminTopbar title="Categories" />
      <div className="admin-content">
        <CategoriesClient categories={categories} />
      </div>
    </>
  )
}
