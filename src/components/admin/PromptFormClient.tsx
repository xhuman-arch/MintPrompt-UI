'use client'

// ============================================================
// MintPrompt — PromptFormClient
// Used for both /admin/prompts/new and /admin/prompts/[id].
// Handles image upload, crop modal, tag input, AI model selection,
// affiliate links management, and publish toggle.
// ============================================================

import Link from 'next/link'
import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
// crop lib used in CropModal (imported there)
import { CropModal } from './CropModal'
import type { SavedCrop } from './CropModal'
import type { Prompt, AffiliateLink, Category } from '@/types/database'

const AI_MODELS = [
  { id:'chatgpt', label:'ChatGPT',    color:'#10a37f' },
  { id:'gemini',  label:'Gemini',     color:'#5ba8ff' },
  { id:'grok',    label:'Grok',       color:'#9b6bff' },
  { id:'flux',    label:'Flux',       color:'#ff6b9d' },
  { id:'mj',      label:'Midjourney', color:'#ff8c42' },
]
const PLATFORMS = ['shopee','tiktok','tokopedia','lazada','other']

interface Props {
  prompt?: Prompt
  categories: Category[]
  affiliateLinks?: AffiliateLink[]
}

export function PromptFormClient({ prompt, categories, affiliateLinks: initLinks = [] }: Props) {
  const router = useRouter()
  const isEdit = !!prompt
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [title, setTitle] = useState(prompt?.title ?? '')
  const [slug, setSlug] = useState(prompt?.slug ?? '')
  const [description, setDescription] = useState(prompt?.description ?? '')
  const [categoryId, setCategoryId] = useState(prompt?.category_id ?? '')
  const [tags, setTags] = useState<string[]>(prompt?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [aiModels, setAiModels] = useState<string[]>(prompt?.ai_models ?? [])
  const [promptChatGPT, setPromptChatGPT] = useState(prompt?.prompt_chatgpt ?? '')
  const [promptGemini, setPromptGemini] = useState(prompt?.prompt_gemini ?? '')
  const [promptGrok, setPromptGrok] = useState(prompt?.prompt_grok ?? '')
  const [negativePrompt, setNegativePrompt] = useState(prompt?.negative_prompt ?? '')
  const [published, setPublished] = useState(prompt?.published ?? false)
  const [imageUrl, setImageUrl] = useState<string | null>(prompt?.image_url ?? null)
  const [affiliates, setAffiliates] = useState<Partial<AffiliateLink>[]>(
    initLinks.length > 0 ? initLinks : [{ product_name:'', affiliate_url:'', platform:'shopee' }]
  )

  // Upload state
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Crop metadata + thumbnail
  const [cropMeta, setCropMeta] = useState<SavedCrop | null>(
    prompt?.crop_x != null
      ? {
          crop_x:      prompt.crop_x!,
          crop_y:      prompt.crop_y!,
          crop_width:  prompt.crop_width ?? 0,
          crop_height: prompt.crop_height ?? 0,
          crop_zoom:   prompt.crop_zoom ?? 1,
          thumbnail_url: prompt.thumbnail_url ?? '',
        }
      : null
  )
  const [showCropModal, setShowCropModal] = useState(false)

  // Submit state
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success'|'error'; msg: string } | null>(null)


  // ─── Auto-slug ─────────────────────────────────────────────
  function handleTitleChange(val: string) {
    setTitle(val)
    if (!isEdit) setSlug(slugify(val))
  }

  // ─── Tags ──────────────────────────────────────────────────
  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }
  function removeTag(t: string) { setTags(prev => prev.filter(x => x !== t)) }
  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
    if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags(prev => prev.slice(0, -1))
    }
  }

  // ─── AI Models ─────────────────────────────────────────────
  function toggleModel(id: string) {
    setAiModels(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // ─── Image Upload ──────────────────────────────────────────
  async function handleImageFile(file: File) {
    if (!file.type.startsWith('image/')) { setFeedback({ type:'error', msg:'Please select an image file.' }); return }
    if (file.size > 10 * 1024 * 1024) { setFeedback({ type:'error', msg:'Image must be under 10 MB.' }); return }

    setUploading(true)
    setUploadProgress(20)
    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploadProgress(50)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      setUploadProgress(90)
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      setImageUrl(url)
      setCropMeta(null)       // Reset crop for new image
      setUploadProgress(100)
      setTimeout(() => {
        setUploadProgress(0)
        setShowCropModal(true) // Auto-open crop modal after upload
      }, 600)
    } catch (err) {
      setFeedback({ type:'error', msg: err instanceof Error ? err.message : 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  // ─── Crop ──────────────────────────────────────────────────
  function handleCropSave(crop: SavedCrop) {
    setCropMeta(crop)
    setShowCropModal(false)
  }

  function updateAffiliate(i: number, field: string, value: string) {
    setAffiliates(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a))
  }
  function addAffiliateRow() {
    setAffiliates(prev => [...prev, { product_name:'', affiliate_url:'', platform:'shopee' }])
  }
  function removeAffiliateRow(i: number) {
    setAffiliates(prev => prev.filter((_, idx) => idx !== i))
  }

  // ─── Affiliate image upload ─────────────────────────────────
  const [affiliateUploading, setAffiliateUploading] = useState<number | null>(null)

  async function handleAffiliateImageFile(i: number, file: File) {
    if (!file.type.startsWith('image/')) return
    setAffiliateUploading(i)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      updateAffiliate(i, 'product_image', url)
    } catch (err) {
      setFeedback({ type: 'error', msg: err instanceof Error ? err.message : 'Upload failed' })
    } finally {
      setAffiliateUploading(null)
    }
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title) { setFeedback({ type:'error', msg:'Title is required.' }); return }

    setFeedback(null)
    startTransition(async () => {
      try {
        const body = {
          title, slug, description, category_id: categoryId || null,
          tags, ai_models: aiModels,
          prompt_chatgpt: promptChatGPT || null,
          prompt_gemini: promptGemini || null,
          prompt_grok: promptGrok || null,
          negative_prompt: negativePrompt || null,
          image_url: imageUrl, published,
          thumbnail_url: cropMeta?.thumbnail_url ?? null,
          crop_x:      cropMeta?.crop_x      ?? null,
          crop_y:      cropMeta?.crop_y      ?? null,
          crop_width:  cropMeta?.crop_width  ?? null,
          crop_height: cropMeta?.crop_height ?? null,
          crop_zoom:   cropMeta?.crop_zoom   ?? null,
          affiliates: affiliates
            .filter(a => a.product_name && a.affiliate_url)
            .map(a => ({
              product_name: a.product_name,
              affiliate_url: a.affiliate_url,
              platform: a.platform ?? 'other',
              product_image: (a as {product_image?: string}).product_image || null,
              cta_label: (a as {cta_label?: string}).cta_label || null,
            })),
        }

        const url = isEdit ? `/api/admin/prompts/${prompt!.id}` : '/api/admin/prompts'
        const method = isEdit ? 'PUT' : 'POST'
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const { error } = await res.json()
          throw new Error(error ?? 'Save failed')
        }
        const saved = await res.json()
        setFeedback({ type:'success', msg: isEdit ? 'Prompt updated!' : 'Prompt created!' })
        if (!isEdit) {
          setTimeout(() => router.push(`/admin/prompts/${saved.id}`), 800)
        }
        router.refresh()
      } catch (err) {
        setFeedback({ type:'error', msg: err instanceof Error ? err.message : 'Save failed' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {feedback && (
        <div className={`form-feedback form-feedback-${feedback.type}`} role="alert">
          {feedback.type === 'success' ? '✓' : '⚠'} {feedback.msg}
        </div>
      )}

      {/* ── BASIC INFO ── */}
      <div className="form-section">
        <div className="form-section-title">Basic Information</div>
        <div className="form-row form-row-2">
          <div className="field">
            <label className="field-label">Title <span className="field-required">*</span></label>
            <input className="field-input" placeholder="Tokyo Rainy Night"
              value={title} onChange={e => handleTitleChange(e.target.value)} required />
          </div>
          <div className="field">
            <label className="field-label">Slug</label>
            <input className="field-input" placeholder="auto-generated"
              value={slug} onChange={e => setSlug(slugify(e.target.value))} />
            <span className="field-hint">URL: /prompt/{slug || '…'}</span>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label className="field-label">Description</label>
            <textarea className="field-textarea" rows={3}
              placeholder="A short description shown on the card hover overlay…"
              value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>

        <div className="form-row form-row-2">
          <div className="field">
            <label className="field-label">Category</label>
            <select className="field-select" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">— Select category —</option>
              {categories.filter(c => c.slug !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">Tags</label>
            <div className="tag-input-wrap" onClick={() => document.getElementById('tag-in')?.focus()}>
              {tags.map(t => (
                <span key={t} className="tag-pill">
                  {t}
                  <button type="button" className="tag-pill-remove" onClick={() => removeTag(t)}>×</button>
                </span>
              ))}
              <input id="tag-in" className="tag-input" placeholder={tags.length ? '' : 'Add tag, press Enter…'}
                value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown} onBlur={addTag} />
            </div>
            <span className="field-hint">Press Enter or comma to add</span>
          </div>
        </div>
      </div>

      {/* ── IMAGE UPLOAD + CROP ── */}
      <div className="form-section">
        <div className="form-section-title">Prompt Image</div>
        {imageUrl ? (
          <div className="image-crop-panel">
            {/* WYSIWYG preview — identical rendering to frontend gallery card */}
            <div className="image-crop-preview-wrap">
              <p className="image-crop-preview-label">
                Gallery Card Preview
                <span className="image-crop-preview-sub">
                  {cropMeta ? '✓ Crop applied' : 'No crop — showing default cover'}
                </span>
              </p>
              <div className="image-crop-card-preview">
                {(() => {
                  // Thumbnail = real generated image = exact match to frontend
                  const src = cropMeta?.thumbnail_url || imageUrl
                  const fx  = cropMeta?.crop_x ?? 50
                  const fy  = cropMeta?.crop_y ?? 20
                  return (
                    <img
                      src={src}
                      alt="Card preview"
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        // Only use objectPosition if no thumbnail (fallback)
                        ...(cropMeta?.thumbnail_url ? {} : { objectPosition: `${fx}% ${fy}%` }),
                        display: 'block',
                      }}
                      draggable={false}
                    />
                  )
                })()}
                {/* Card title overlay */}
                <div className="image-crop-card-overlay">
                  <div className="image-crop-card-title">{title || 'Card Title'}</div>
                </div>
              </div>
            </div>

            {/* Actions */}

            <div className="image-crop-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowCropModal(true)}
              >
                <CropBtnIcon />
                {cropMeta ? 'Adjust Crop' : 'Set Crop'}
              </button>
              {cropMeta && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCropMeta(null)}
                >
                  Clear Crop
                </button>
              )}
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}
                onClick={() => { setImageUrl(null); setCropMeta(null) }}
              >
                ✕ Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-zone"
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag-over') }}
            onDragLeave={e => e.currentTarget.classList.remove('drag-over')}
            onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('drag-over');
              const f = e.dataTransfer.files[0]; if(f) handleImageFile(f) }}>
            <input ref={fileInputRef} type="file" accept="image/*"
              onChange={e => { const f = e.target.files?.[0]; if(f) handleImageFile(f) }} />
            <div className="upload-icon">🖼</div>
            <div className="upload-text">
              <strong>Click to upload</strong> or drag & drop
            </div>
            <div className="upload-hint">JPEG, PNG, WebP, AVIF · Max 10 MB</div>
          </div>
        )}
        {uploading && (
          <div className="upload-progress" style={{ marginTop: 8 }}>
            <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
      </div>

      {/* Crop modal — full screen, portal-like */}
      {showCropModal && imageUrl && (
        <CropModal
          imageUrl={imageUrl}
          initialCrop={cropMeta}
          onSave={handleCropSave}
          onCancel={() => setShowCropModal(false)}
        />
      )}

      {/* ── AI MODELS ── */}
      <div className="form-section">
        <div className="form-section-title">AI Models</div>

        <div className="model-checks">
          {AI_MODELS.map(m => (
            <label key={m.id} className="model-check">
              <input type="checkbox" checked={aiModels.includes(m.id)}
                onChange={() => toggleModel(m.id)} />
              <span className="model-check-label">
                <span className="model-dot" style={{ background: m.color }} />
                {m.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ── PROMPTS ── */}
      <div className="form-section">
        <div className="form-section-title">Prompts by Platform</div>
        <div className="form-row">
          <div className="field">
            <label className="field-label" style={{ color:'#10a37f' }}>ChatGPT Prompt</label>
            <textarea className="field-textarea" rows={4}
              placeholder="Cinematic portrait of…"
              value={promptChatGPT} onChange={e => setPromptChatGPT(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label className="field-label" style={{ color:'#5ba8ff' }}>Gemini Prompt</label>
            <textarea className="field-textarea" rows={4}
              placeholder="Dark cinematic photography:…"
              value={promptGemini} onChange={e => setPromptGemini(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label className="field-label" style={{ color:'#9b6bff' }}>Grok Prompt</label>
            <textarea className="field-textarea" rows={4}
              placeholder="Hyperrealistic photograph,…"
              value={promptGrok} onChange={e => setPromptGrok(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label className="field-label" style={{ color:'#ff6b6b' }}>Negative Prompt</label>
            <textarea className="field-textarea" rows={2}
              placeholder="cartoonish, bright colors, daytime…"
              value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── AFFILIATE LINKS ── */}
      <div className="form-section">
        <div className="form-section-title" style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          Shop This Aesthetic — Affiliate Products
          <button type="button" className="btn btn-ghost btn-sm" onClick={addAffiliateRow}>+ Add Product</button>
        </div>
        <div className="affiliate-list">
          {affiliates.map((a, i) => (
            <div key={i} className="affiliate-row affiliate-row-expanded">
              <div className="affiliate-row-top">
                <div className="field" style={{ flex: 2 }}>
                  <div className="affiliate-row-label">Product Name</div>
                  <input className="field-input" placeholder="Oversized Aesthetic Hoodie"
                    value={a.product_name ?? ''} onChange={e => updateAffiliate(i,'product_name',e.target.value)} />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <div className="affiliate-row-label">Platform</div>
                  <select className="field-select" value={a.platform ?? 'shopee'}
                    onChange={e => updateAffiliate(i,'platform',e.target.value)}>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                  </select>
                </div>
                <button type="button" className="btn-icon" style={{ alignSelf:'flex-end',marginBottom:2 }}
                  onClick={() => removeAffiliateRow(i)} title="Remove">
                  <TrashIcon />
                </button>
              </div>
                <div className="affiliate-row-bottom">
                <div className="field" style={{ flex: 2 }}>
                  <div className="affiliate-row-label">Affiliate URL</div>
                  <input className="field-input" placeholder="https://shopee.co.id/…"
                    value={a.affiliate_url ?? ''} onChange={e => updateAffiliate(i,'affiliate_url',e.target.value)} />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <div className="affiliate-row-label">
                    Product Image <span style={{opacity:0.5,fontWeight:400}}>(optional)</span>
                  </div>
                  {/* Upload UI — same pattern as main image */}
                  {(a as {product_image?: string}).product_image ? (
                    <div className="affiliate-img-preview">
                      <img
                        src={(a as {product_image?: string}).product_image}
                        alt="Product"
                        className="affiliate-img-thumb"
                      />
                      <button
                        type="button"
                        className="affiliate-img-remove"
                        onClick={() => updateAffiliate(i, 'product_image', '')}
                        title="Remove image"
                      >✕</button>
                    </div>
                  ) : (
                    <label className="affiliate-img-upload">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={affiliateUploading !== null}
                        onChange={e => {
                          const f = e.target.files?.[0]
                          if (f) handleAffiliateImageFile(i, f)
                          e.target.value = ''
                        }}
                      />
                      {affiliateUploading === i ? (
                        <span className="affiliate-img-uploading">⏳ Uploading…</span>
                      ) : (
                        <span className="affiliate-img-placeholder">
                          <UploadIcon /> Upload image
                        </span>
                      )}
                    </label>
                  )}
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <div className="affiliate-row-label">CTA Label <span style={{opacity:0.5,fontWeight:400}}>(optional)</span></div>
                  <input className="field-input" placeholder="Get the Look"
                    value={(a as {cta_label?: string}).cta_label ?? ''} onChange={e => updateAffiliate(i,'cta_label',e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PUBLISH ── */}
      <div className="form-section">
        <div className="form-section-title">Visibility</div>
        <label className="toggle-wrap">
          <span className="toggle">
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
            <span className="toggle-track" />
          </span>
          <span className="toggle-label">
            {published ? '🟢 Published — visible on the gallery' : '⚫ Draft — hidden from public'}
          </span>
        </label>
      </div>

      {/* ── ACTIONS ── */}
      <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
        <Link href="/admin/prompts" className="btn btn-ghost">Cancel</Link>
        <button type="submit" className="btn btn-primary" disabled={isPending || uploading}>
          {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Prompt'}
        </button>
      </div>
    </form>
  )
}

function UploadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
}

function CropBtnIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6.13 1L6 16a2 2 0 002 2h15" /><path d="M1 6.13L16 6a2 2 0 012 2v15" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}
