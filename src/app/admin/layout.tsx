// ============================================================
// MintPrompt — Admin Layout (DEMO MODE)
// Authentication check is bypassed — dashboard is accessible
// to showcase the UI with mock data.
// ============================================================

import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import '@/styles/admin.css'

export const metadata: Metadata = {
  title: { default: 'Admin — MintPrompt', template: '%s — Admin' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Demo mode: no auth check, use placeholder user info
  const userEmail = 'demo@mintprompt.com'
  const userInitial = 'D'

  return (
    <div className="admin-shell">
      <AdminSidebar userEmail={userEmail} userInitial={userInitial} />
      <main className="admin-main">{children}</main>
    </div>
  )
}
