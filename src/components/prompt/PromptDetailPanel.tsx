'use client'

// ============================================================
// MintPrompt — PromptDetailPanel
// Slide-in sheet showing full prompt details, copy buttons,
// affiliate products, and related prompts.
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { fetchPromptBySlug, fetchRelatedPrompts } from '@/lib/api/prompts.client'
import { getStorageUrl } from '@/lib/supabase/storage'
import { copyToClipboard, formatCount, AI_MODEL_CONFIG, PLATFORM_CONFIG } from '@/lib/utils'
import { trackView, trackCopy, trackLike, trackAffiliateClick, shouldRedirectAffiliate } from '@/lib/analytics'
import type { Prompt, AIModel, AffiliateLink } from '@/types/database'

type TabId = 'chatgpt' | 'gemini' | 'grok'

interface PromptDetailPanelProps {
  slug: string | null
  onClose: () => void
  onRelatedClick: (prompt: Prompt) => void
}

export function PromptDetailPanel({ slug, onClose, onRelatedClick }: PromptDetailPanelProps) {
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [related, setRelated] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('chatgpt')
  const [copiedTab, setCopiedTab] = useState<TabId | null>(null)
  const [liked, setLiked] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const isOpen = !!slug

  // Load prompt when slug changes
  useEffect(() => {
    if (!slug) { setPrompt(null); return }
    setLoading(true)
    setLiked(false)
    setActiveTab('chatgpt')

    fetchPromptBySlug(slug)
      .then((p) => {
        setPrompt(p)
        if (p) {
          trackView(p.id)
          // Pick the first available tab
          if (p.prompt_chatgpt) setActiveTab('chatgpt')
          else if (p.prompt_gemini) setActiveTab('gemini')
          else if (p.prompt_grok) setActiveTab('grok')

          // Load related prompts
          fetchRelatedPrompts(p.id, p.category_id ?? null, p.ai_models as AIModel[], 3)
            .then(setRelated)
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2200)
  }, [])

  const handleCopy = useCallback(async (tab: TabId) => {
    if (!prompt) return
    const textMap: Record<TabId, string | null> = {
      chatgpt: prompt.prompt_chatgpt,
      gemini: prompt.prompt_gemini,
      grok: prompt.prompt_grok,
    }
    const text = textMap[tab]
    if (!text) return

    const ok = await copyToClipboard(text)
    if (ok) {
      setCopiedTab(tab)
      setTimeout(() => setCopiedTab(null), 2000)
      trackCopy(prompt.id, tab)
      showToast('Prompt copied to clipboard!')
    }
  }, [prompt, showToast])

  const handleLike = useCallback(() => {
    if (!prompt || liked) return
    setLiked(true)
    trackLike(prompt.id)
    showToast('Liked! ♥')
  }, [prompt, liked, showToast])

  const handleAffiliateClick = useCallback((link: AffiliateLink) => {
    if (!prompt) return
    trackAffiliateClick(prompt.id, link.platform, link.product_name)

    // Throttled redirect
    const doRedirect = shouldRedirectAffiliate()
    if (doRedirect) {
      window.open(link.affiliate_url, '_blank', 'noopener,noreferrer')
    } else {
      window.open(link.affiliate_url, '_blank', 'noopener,noreferrer')
    }
    showToast(`Opening ${PLATFORM_CONFIG[link.platform]?.label ?? 'Shop'}...`)
  }, [prompt, showToast])

  // heroUrl for the thumbnail card (left side of info card)
  const heroUrl = getStorageUrl(prompt?.thumbnail_url) ?? getStorageUrl(prompt?.image_url)
  const aiModels = prompt?.ai_models ?? []

  const tabs: Array<{ id: TabId; label: string; text: string | null | undefined }> = [
    { id: 'chatgpt', label: 'ChatGPT', text: prompt?.prompt_chatgpt },
    { id: 'gemini',  label: 'Gemini',  text: prompt?.prompt_gemini },
    { id: 'grok',    label: 'Grok',    text: prompt?.prompt_grok },
  ].filter((t) => t.text) as Array<{ id: TabId; label: string; text: string }>

  return (
    <>
      {/* Backdrop */}
      <div
        className={`detail-backdrop ${isOpen ? 'detail-backdrop-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <aside
        className={`detail-sheet ${isOpen ? 'detail-sheet-open' : ''}`}
        aria-label="Prompt details"
        role="dialog"
        aria-modal="true"
      >
        {/* Drag handle — visible on mobile only */}
        <div className="detail-drag-handle" aria-hidden="true" />

        {/* Close button */}
        <button className="detail-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {loading && (
          <div className="detail-loading">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        )}

        {!loading && prompt && (
          <div className="detail-inner">

            {/* ── TOP INFO CARD: thumbnail (left) + meta (right) ── */}
            <div className="detail-info-card">
              <div className="detail-thumb">
                {heroUrl ? (
                  <img src={heroUrl} alt={prompt.title} className="detail-thumb-img" loading="eager" decoding="async" />
                ) : (
                  <div className="detail-thumb-placeholder" />
                )}
              </div>
              <div className="detail-meta-col">
                <h1 className="detail-title">{prompt.title}</h1>
                <div className="detail-tags-row">
                  {aiModels.map((m) => {
                    const cfg = AI_MODEL_CONFIG[m]
                    return cfg ? (
                      <span key={m} className="detail-ai-tag"
                        style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}35` }}>
                        {cfg.label}
                      </span>
                    ) : null
                  })}
                </div>
                <div className="detail-stats-row">
                  <span className="detail-stat"><EyeIcon /> {formatCount(prompt.views)} views</span>
                  <span className="detail-stat"><HeartIconOutline /> {formatCount(prompt.likes + (liked ? 1 : 0))} likes</span>
                </div>
                {prompt.description && <p className="detail-desc">{prompt.description}</p>}
                <button className={`like-btn ${liked ? 'like-btn-active' : ''}`} onClick={handleLike} disabled={liked}>
                  <HeartIconOutline /> {liked ? 'Liked! ♥' : 'Like this prompt'}
                </button>
              </div>
            </div>

            {/* ── BODY ── */}
            <div className="detail-body">

              {/* Affiliate */}
              {(prompt.affiliate_links?.length ?? 0) > 0 && (
                <div className="shop-section">
                  <p className="section-label">🛍️ Shop This Aesthetic</p>
                  <div className="shop-grid">
                    {prompt.affiliate_links!.sort((a, b) => a.sort_order - b.sort_order).map((link) => {
                      const platform = PLATFORM_CONFIG[link.platform] ?? PLATFORM_CONFIG.other
                      const ctaLabel = link.cta_label || platform.cta || 'Shop Now'
                      return (
                        <div key={link.id} className="product-card"
                          onClick={() => handleAffiliateClick(link)}
                          role="button" tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleAffiliateClick(link)}
                          aria-label={`Shop ${link.product_name} on ${platform.label}`}>
                          <div className="product-thumb">
                            {link.product_image ? (
                              <Image src={link.product_image} alt={link.product_name} fill sizes="200px" className="product-img" />
                            ) : (
                              <div className="product-thumb-empty"><span className="product-emoji">🛍️</span></div>
                            )}
                            <div className="product-badge" style={{ background: platform.color }}>{platform.label}</div>
                          </div>
                          <div className="product-info">
                            <p className="product-name">{link.product_name}</p>
                            <button className="product-cta-btn" style={{ '--cta-color': platform.color } as React.CSSProperties}>
                              <span>{ctaLabel}</span><ArrowIcon />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Prompt tabs */}
              {tabs.length > 0 && (
                <>
                  <div className="tabs" role="tablist">
                    {tabs.map((t) => (
                      <button key={t.id} role="tab" aria-selected={activeTab === t.id}
                        className={`tab-btn ${activeTab === t.id ? 'tab-btn-active' : ''}`}
                        onClick={() => setActiveTab(t.id)}>{t.label}</button>
                    ))}
                  </div>
                  {tabs.map((t) => (
                    <div key={t.id} role="tabpanel" hidden={activeTab !== t.id} className="prompt-box">
                      <p className="prompt-text">{t.text}</p>
                      <button className={`copy-btn ${copiedTab === t.id ? 'copy-btn-copied' : ''}`}
                        onClick={() => handleCopy(t.id)} aria-label={`Copy ${t.label} prompt`}>
                        {copiedTab === t.id ? <CheckIcon /> : <CopyIcon />}
                      </button>
                    </div>
                  ))}
                </>
              )}

              {/* Negative prompt */}
              {prompt.negative_prompt && (
                <><p className="section-label">Negative Prompt</p><div className="neg-box">{prompt.negative_prompt}</div></>
              )}

              {/* Related */}
              {related.length > 0 && (
                <>
                  <p className="section-label" style={{ marginTop: 24 }}>Related Prompts</p>
                  <div className="related-grid">
                    {related.map((rp) => (
                      <div key={rp.id} className="related-card" onClick={() => onRelatedClick(rp)}
                        role="button" tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onRelatedClick(rp)}
                        aria-label={`View related: ${rp.title}`}>
                        <div className="related-thumb">
                          {(rp.thumbnail_url || rp.image_url) ? (
                            <img src={rp.thumbnail_url ?? rp.image_url!} alt={rp.title} className="card-img" loading="lazy" />
                          ) : <div className="related-gradient" />}
                        </div>
                        <div className="related-info"><p className="related-title">{rp.title}</p></div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Toast */}
      {toastMsg && (
        <div className="toast toast-show" role="status" aria-live="polite">
          <div className="toast-icon"><CheckIcon /></div>
          {toastMsg}
        </div>
      )}
    </>
  )
}

// ─── Icons ───────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  )
}

function HeartIconOutline() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}
