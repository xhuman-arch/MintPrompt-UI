// ============================================================
// MintPrompt — Admin Dashboard
// Overview stats + recent prompts + activity.
// ============================================================

import Link from 'next/link'
import type { Metadata } from 'next'
import { adminFetchAnalytics, adminFetchPrompts } from '@/lib/admin/data'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { formatCount, AI_MODEL_CONFIG } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [analytics, { data: recentPrompts }] = await Promise.all([
    adminFetchAnalytics(),
    adminFetchPrompts({ page: 1 }),
  ])

  const statCards = [
    { label: 'Total Views',     value: formatCount(analytics.totalViews),           cls: 'stat-card-accent' },
    { label: 'Total Likes',     value: formatCount(analytics.totalLikes),            cls: 'stat-card-pink' },
    { label: 'Prompt Copies',   value: formatCount(analytics.totalCopies),           cls: 'stat-card-blue' },
    { label: 'Affiliate Clicks',value: formatCount(analytics.totalAffiliateClicks),  cls: 'stat-card-orange' },
    { label: 'Published Prompts', value: String(recentPrompts.length),               cls: 'stat-card-purple' },
  ]

  const topModels = Object.entries(analytics.modelCopies)
    .sort(([,a],[,b]) => b - a)
  const maxViews = Math.max(...analytics.topPrompts.map(p => p.views), 1)

  return (
    <>
      <AdminTopbar title="Dashboard">
        <Link href="/admin/prompts/new" className="btn btn-primary btn-sm">
          + Upload Prompt
        </Link>
      </AdminTopbar>

      <div className="admin-content">
        {/* Stat cards */}
        <div className="stats-grid">
          {statCards.map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-label">{s.label}</div>
              <div className={`stat-card-value ${s.cls}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Two-column analytics */}
        <div className="analytics-grid">
          {/* Top prompts by views */}
          <div className="chart-card">
            <div className="chart-card-title">
              Top Prompts by Views
              <a href="/admin/analytics" style={{ fontSize:11,color:'var(--muted)',textDecoration:'none' }}>
                See all →
              </a>
            </div>
            {analytics.topPrompts.slice(0, 6).map(p => (
              <div key={p.id} className="chart-bar-row">
                <div className="chart-bar-label" title={p.title}>{p.title}</div>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill"
                    style={{ width: `${Math.round((p.views / maxViews) * 100)}%` }} />
                </div>
                <div className="chart-bar-val">{formatCount(p.views)}</div>
              </div>
            ))}
            {analytics.topPrompts.length === 0 && (
              <p style={{ fontSize:12,color:'var(--muted2)',textAlign:'center',padding:'20px 0' }}>
                No data yet
              </p>
            )}
          </div>

          {/* Copies by AI model */}
          <div className="chart-card">
            <div className="chart-card-title">Copies by AI Model</div>
            {topModels.length > 0 ? topModels.map(([model, count]) => {
              const cfg = AI_MODEL_CONFIG[model]
              return (
                <div key={model} className="model-stat-row">
                  <div className="model-stat-name">
                    <span style={{ width:8,height:8,borderRadius:'50%',
                      background: cfg?.color ?? 'var(--muted)',display:'inline-block' }} />
                    {cfg?.label ?? model}
                  </div>
                  <div className="model-stat-count">{count} copies</div>
                </div>
              )
            }) : (
              <div className="chart-bar-row" style={{ justifyContent:'center',padding:'20px 0' }}>
                <p style={{ fontSize:12,color:'var(--muted2)' }}>No copy events yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent prompts table */}
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <span className="admin-table-title">Recent Prompts</span>
            <Link href="/admin/prompts" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>AI Models</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPrompts.slice(0, 8).map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                      <div className="table-thumb">
                        {p.image_url
                          ? <img src={p.image_url} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                          : '🖼'}
                      </div>
                      <div>
                        <div style={{ fontWeight:500,fontSize:13 }}>{p.title}</div>
                        <div className="td-mono">/{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display:'flex',gap:4,flexWrap:'wrap' }}>
                      {(p.ai_models ?? []).map(m => {
                        const cfg = AI_MODEL_CONFIG[m]
                        return cfg ? (
                          <span key={m} className="badge"
                            style={{ color:cfg.color,background:cfg.bg,border:`1px solid ${cfg.color}30` }}>
                            {cfg.label}
                          </span>
                        ) : null
                      })}
                    </div>
                  </td>
                  <td className="td-muted">{formatCount(p.views)}</td>
                  <td className="td-muted">{formatCount(p.likes)}</td>
                  <td>
                    <span className={`badge ${p.published ? 'badge-green' : 'badge-red'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/prompts/${p.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                  </td>
                </tr>
              ))}
              {recentPrompts.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-empty">
                      <div className="admin-empty-icon">✦</div>
                      <p>No prompts yet</p>
                      <p className="admin-empty-sub">Upload your first prompt to get started.</p>
                      <Link href="/admin/prompts/new" className="btn btn-primary btn-sm">Upload Prompt</Link>
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
