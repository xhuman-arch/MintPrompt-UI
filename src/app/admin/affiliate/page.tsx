// ============================================================
// MintPrompt — /admin/affiliate (DEMO MODE)
// ============================================================

import Link from 'next/link'
import type { Metadata } from 'next'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { PLATFORM_CONFIG } from '@/lib/utils'
import { MOCK_PROMPTS } from '../../../../mock/prompts'

export const metadata: Metadata = { title: 'Affiliate Links' }

export default async function AffiliatePage() {
  const allLinks = MOCK_PROMPTS
    .flatMap((p) => (p.affiliate_links ?? []).map((l) => ({ ...l, prompt: { id: p.id, title: p.title, slug: p.slug } })))

  return (
    <>
      <AdminTopbar title={`Affiliate Links (${allLinks.length})`} />
      <div className="admin-content">
        <div className="form-feedback"
          style={{ background:'var(--bg3)',border:'1px solid var(--border2)',
            borderRadius:'var(--r2)',padding:'12px 16px',fontSize:13,color:'var(--muted)',marginBottom:20 }}>
          🎭 <strong>Demo Mode</strong> — Showing mock affiliate links. Real links are managed per-prompt in production.
        </div>

        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <span className="admin-table-title">All Affiliate Links</span>
            <Link href="/admin/prompts" className="btn btn-ghost btn-sm">Manage via Prompts</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Platform</th>
                <th>Prompt</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allLinks.map(link => {
                const platform = PLATFORM_CONFIG[link.platform as keyof typeof PLATFORM_CONFIG] ?? PLATFORM_CONFIG.other
                return (
                  <tr key={link.id}>
                    <td style={{ fontWeight:500 }}>{link.product_name}</td>
                    <td>
                      <span className="badge"
                        style={{ background:`${platform.color}18`, color:platform.color,
                          border:`1px solid ${platform.color}30` }}>
                        {platform.label}
                      </span>
                    </td>
                    <td>
                      <a href={`/admin/prompts/${link.prompt.id}`} style={{ color:'var(--accent)',textDecoration:'none',fontSize:12 }}>
                        {link.prompt.title}
                      </a>
                    </td>
                    <td>
                      <span className="td-mono" style={{ color:'var(--blue)',fontSize:11 }}>
                        {link.affiliate_url.slice(0, 40)}{link.affiliate_url.length > 40 ? '…' : ''}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/prompts/${link.prompt.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                    </td>
                  </tr>
                )
              })}
              {allLinks.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-empty">
                      <div className="admin-empty-icon">🛍️</div>
                      <p>No affiliate links yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
