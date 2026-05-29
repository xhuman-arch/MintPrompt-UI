'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types/database'

interface Props { categories: Category[] }

export function CategoriesClient({ categories: init }: Props) {
  const router = useRouter()
  const [categories] = useState(init)
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setError(null)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), slug: slugify(newName) }),
    })
    if (!res.ok) { setError('Failed to create category'); return }
    setNewName('')
    startTransition(() => router.refresh())
  }

  async function handleEdit(cat: Category) {
    if (!editName.trim()) return
    setError(null)
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim(), slug: slugify(editName) }),
    })
    if (!res.ok) { setError('Failed to update category'); return }
    setEditId(null)
    startTransition(() => router.refresh())
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: 'DELETE' })
    if (!res.ok) { setError('Failed to delete (may have prompts assigned)'); return }
    setDeleteTarget(null)
    startTransition(() => router.refresh())
  }

  return (
    <>
      {error && <div className="form-feedback form-feedback-error">⚠ {error}</div>}

      {/* Add new */}
      <div className="form-section" style={{ marginBottom: 20 }}>
        <div className="form-section-title">Add New Category</div>
        <form onSubmit={handleAdd} style={{ display:'flex', gap:10 }}>
          <input className="field-input" placeholder="e.g. Dark Academia"
            value={newName} onChange={e => setNewName(e.target.value)} style={{ maxWidth:280 }} />
          <button type="submit" className="btn btn-primary" disabled={!newName.trim() || isPending}>
            + Add Category
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">All Categories ({init.length})</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Sort Order</th>
              <th style={{ width:140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>
                  {editId === cat.id ? (
                    <input className="field-input" value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if(e.key==='Enter') handleEdit(cat); if(e.key==='Escape') setEditId(null) }}
                      autoFocus style={{ maxWidth:200 }} />
                  ) : (
                    <span style={{ fontWeight:500 }}>{cat.name}</span>
                  )}
                </td>
                <td className="td-mono">{cat.slug}</td>
                <td className="td-muted">{cat.sort_order}</td>
                <td>
                  {editId === cat.id ? (
                    <div style={{ display:'flex',gap:6 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(cat)}>Save</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display:'flex',gap:6 }}>
                      <button className="btn btn-ghost btn-sm"
                        onClick={() => { setEditId(cat.id); setEditName(cat.name) }}>Edit</button>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(cat)}
                        disabled={cat.slug === 'all'}>Del</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Delete Category?</div>
            <div className="modal-body">
              Delete <strong>&ldquo;{deleteTarget.name}&rdquo;</strong>? Prompts in this category will be uncategorised.
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
