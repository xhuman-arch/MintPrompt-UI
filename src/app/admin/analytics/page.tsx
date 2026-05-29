// ============================================================
// MintPrompt — /admin/analytics (DEMO MODE)
// Shows mock analytics data — no real event tracking.
// ============================================================

import type { Metadata } from 'next'
import { adminFetchAnalytics } from '@/lib/admin/data'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { formatCount, AI_MODEL_CONFIG } from '@/lib/utils'
import { MOCK_PROMPTS } from '../../../../mock/prompts'

export const metadata: Metadata = { title: 'Analytics' }

interface MockEvent {
  event_type: string
  prompt_id: string | null
  created_at: string
}

const MOCK_EVENTS: MockEvent[] = [
  { event_type: 'view',             prompt_id: 'prompt-006', created_at: new Date(Date.now() - 60000).toISOString() },
  { event_type: 'copy',             prompt_id: 'prompt-003', created_at: new Date(Date.now() - 120000).toISOString() },
  { event_type: 'like',             prompt_id: 'prompt-010', created_at: new Date(Date.now() - 180000).toISOString() },
  { event_type: 'affiliate_click',  prompt_id: 'prompt-001', created_at: new Date(Date.now() - 240000).toISOString() },
  { event_type: 'copy',             prompt_id: 'prompt-002', created_at: new Date(Date.now() - 300000).toISOString() },
  { event_type: 'view',             prompt_id: 'prompt-009', created_at: new Date(Date.now() - 360000).toISOString() },
]

export default async function AnalyticsPage() {
  const a = await adminFetchAnalytics()

  // Enrich topPrompts with copy_count for the chart
  const enrichedTopPrompts = a.topPrompts.map(p => {
    const full = MOCK_PROMPTS.find(m => m.id === p.id)
    return { ...p, copy_count: full?.copy_count ?? 0 }
  })

  const maxViews  = Math.max(...enrichedTopPrompts.map(p => p.views), 1)
  const maxCopies = Math.max(...enrichedTopPrompts.map(p => p.copy_count), 1)
  const topModels = Object.entries(a.modelCopies).sort(([,x],[,y]) => y - x)

  const EVENT_LABELS: Record<string, string> = {
    view: '👁 View', copy: '📋 Copy', like: '❤️ Like', affiliate_click: '🛍 Affiliate',
  }

  return (
    <>
      <AdminTopbar title="Analytics" />
      <div className="admin-content">

        {/* Demo banner */}
        <div className="form-feedback" style={{
          background: 'rgba(200,255,87,0.08)',
          border: '1px solid rgba(200,255,87,0.3)',
          color: '#c8ff57',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 13,
          marginBottom: 20,
        }}>
          🎭 <strong>Demo Mode</strong> — Showing mock analytics. Real event tracking requires a connected Supabase project.
        </div>

        {/* Top stats */}
        <div className="stats-grid">
          {[
            { label: 'Total Views',       value: formatCount(a.totalViews),          cls: 'stat-card-accent' },
            { label: 'Total Likes',       value: formatCount(a.totalLikes),           cls: 'stat-card-pink' },
            { label: 'Prompt Copies',     value: formatCount(a.totalCopies),          cls: 'stat-card-blue' },
            { label: 'Affiliate Clicks',  value: formatCount(a.totalAffiliateClicks), cls: 'stat-card-orange' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-label">{s.label}</div>
              <div className={`stat-card-value ${s.cls}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="analytics-grid">
          {/* Top prompts by views */}
          <div className="chart-card">
            <div className="chart-card-title">Top Prompts — Views</div>
            {enrichedTopPrompts.map(p => (
              <div key={p.id} className="chart-bar-row">
                <div className="chart-bar-label" title={p.title}>{p.title}</div>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${Math.round((p.views / maxViews) * 100)}%` }} />
                </div>
                <div className="chart-bar-val">{formatCount(p.views)}</div>
              </div>
            ))}
          </div>

          {/* Top prompts by copies */}
          <div className="chart-card">
            <div className="chart-card-title">Top Prompts — Copies</div>
            {enrichedTopPrompts.map(p => (
              <div key={p.id} className="chart-bar-row">
                <div className="chart-bar-label" title={p.title}>{p.title}</div>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill"
                    style={{ width: `${Math.round((p.copy_count / maxCopies) * 100)}%`, background: 'var(--blue)' }} />
                </div>
                <div className="chart-bar-val">{formatCount(p.copy_count)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Model breakdown */}
        <div className="chart-card" style={{ marginBottom: 20 }}>
          <div className="chart-card-title">Copy Events by AI Model</div>
          {topModels.map(([model, count]) => {
            const cfg = AI_MODEL_CONFIG[model as keyof typeof AI_MODEL_CONFIG]
            const maxCount = topModels[0][1]
            return (
              <div key={model} className="chart-bar-row">
                <div className="chart-bar-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg?.color ?? '#888', display: 'inline-block' }} />
                  {cfg?.label ?? model}
                </div>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill"
                    style={{ width: `${Math.round((count / maxCount) * 100)}%`, background: cfg?.color ?? 'var(--accent)' }} />
                </div>
                <div className="chart-bar-val">{count}</div>
              </div>
            )
          })}
        </div>

        {/* Recent events (mock) */}
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <span className="admin-table-title">Recent Events (mock demo data)</span>
          </div>
          <table>
            <thead>
              <tr><th>Event</th><th>Prompt ID</th><th>Time</th></tr>
            </thead>
            <tbody>
              {MOCK_EVENTS.map((ev, i) => (
                <tr key={i}>
                  <td><span className="badge badge-lime">{EVENT_LABELS[ev.event_type] ?? ev.event_type}</span></td>
                  <td className="td-mono">{ev.prompt_id?.slice(0, 8) ?? '—'}</td>
                  <td className="td-muted">{new Date(ev.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
