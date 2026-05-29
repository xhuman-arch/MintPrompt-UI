'use client'

// ============================================================
// MintPrompt — PromptsTableClient
// Interactive table: search, filter, publish toggle, delete.
// ============================================================

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { formatCount, AI_MODEL_CONFIG } from '@/lib/utils'
import type { Prompt } from '@/types/database'

interface Props {
  prompts: Prompt[]
  count: number
  page: number
  hasMore: boolean
  searchDefault: string
  publishedFilter: string
}

export function PromptsTableClient({ prompts: initial, count, page, hasMore, searchDefault, publishedFilter }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState(searchDefault)
  const [filter, setFilter] = useState(publishedFilter)
  const [deleteTarget, setDeleteTarget] = useState<Prompt | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function navigate(overrides: Record<string, string>) {
    const params = new URLSearchParams({
      ...(search && { search }),
      ...(filter !== 'all' && { published: filter }),
      page: String(page),
      ...overrides,
    })
    router.push(`/admin/prompts?${params}`)
    router.refresh()
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate({ page: '1' })
  }

  function handleFilterChange(val: string) {
    setFilter(val)
    const params = new URLSearchParams({
      ...(search && { search }),
      ...(val !== 'all' && { published: val }),
      page: '1',
    })
    router.push(`/admin/prompts?${params}`)
    router.refresh()
  }

  async function handleTogglePublish(prompt: Prompt) {
    setTogglingId(prompt.id)
    try {
      const res = await fetch(`/api/admin/prompts/${prompt.id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !prompt.published }),
      })
      if (!res.ok) throw new Error('Failed')
      startTransition(() => { router.refresh() })
    } catch { /* silent */ }
    finally { setTogglingId(null) }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/prompts/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      setDeleteTarget(null)
      startTransition(() => { router.refresh() })
    } catch { /* silent */ }
  }

  return (
    <>
      <div className="admin-table-wrap">
        {/* Search + filter bar */}
        <div className="admin-table-header">
          <form onSubmit={handleSearchSubmit} style={{ display:'flex',gap:8 }}>
            <input className="admin-search" placeholder="Search prompts…"
              value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="btn btn-ghost btn-sm">Search</button>
          </form>
          <div style={{ display:'flex',gap:6 }}>
            {['all','published','draft'].map(f => (
              <button key={f} onClick={() => handleFilterChange(f)}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style={{ width:44 }}></th>
              <th>Title</th>
              <th>AI Models</th>
              <th>Views</th>
              <th>Copies</th>
              <th>Status</th>
              <th style={{ width:120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initial.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="table-thumb">
                    {p.image_url
                      ? <img src={p.image_url} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                      : <span>🖼</span>}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight:500 }}>{p.title}</div>
                  <div className="td-mono">{p.slug}</div>
                </td>
                <td>
                  <div style={{ display:'flex',gap:4,flexWrap:'wrap' }}>
                    {(p.ai_models ?? []).map(m => {
                      const cfg = AI_MODEL_CONFIG[m]
                      return cfg ? (
                        <span key={m} className="badge"
                          style={{ color:cfg.color,background:cfg.bg,border:`1px solid ${cfg.color}30`,fontSize:9 }}>
                          {cfg.label}
                        </span>
                      ) : null
                    })}
                  </div>
                </td>
                <td className="td-muted">{formatCount(p.views)}</td>
                <td className="td-muted">{formatCount(p.copy_count)}</td>
                <td>
                  <label className="toggle-wrap" title={p.published ? 'Click to unpublish' : 'Click to publish'}>
                    <span className="toggle">
                      <input type="checkbox" checked={p.published}
                        disabled={togglingId === p.id}
                        onChange={() => handleTogglePublish(p)} />
                      <span className="toggle-track" />
                    </span>
                    <span className="toggle-label" style={{ fontSize:11 }}>
                      {togglingId === p.id ? '…' : p.published ? 'Live' : 'Draft'}
                    </span>
                  </label>
                </td>
                <td>
                  <div style={{ display:'flex',gap:6 }}>
                    <a href={`/admin/prompts/${p.id}`} className="btn btn-ghost btn-sm">Edit</a>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(p)}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
            {initial.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div className="admin-empty">
                    <div className="admin-empty-icon">✦</div>
                    <p>No prompts found</p>
                    <p className="admin-empty-sub">Try a different search or filter.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="admin-pagination">
          <span className="pagination-info">
            Page {page} · {count} total prompts
          </span>
          <div className="pagination-btns">
            {page > 1 && (
              <button className="btn btn-ghost btn-sm" onClick={() => navigate({ page: String(page - 1) })}>
                ← Prev
              </button>
            )}
            {hasMore && (
              <button className="btn btn-ghost btn-sm" onClick={() => navigate({ page: String(page + 1) })}>
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Delete Prompt?</div>
            <div className="modal-body">
              Are you sure you want to delete <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>?
              This will also remove all affiliate links for this prompt. This action cannot be undone.
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
