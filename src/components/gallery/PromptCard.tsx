'use client'

import { formatCount, AI_MODEL_CONFIG } from '@/lib/utils'
import { getStorageUrl } from '@/lib/supabase/storage'
import { getCropImageStyle } from '@/lib/crop'
import type { Prompt } from '@/types/database'
const GRADIENTS = [
  'linear-gradient(160deg,#1a1a2e 0%,#16213e 40%,#533483 100%)',
  'linear-gradient(135deg,#2c1810 0%,#4a2c1a 50%,#8b6914 100%)',
  'linear-gradient(135deg,#0d001a 0%,#1a0033 40%,#1a1a4e 100%)',
  'linear-gradient(160deg,#0a0a14 0%,#1a1a2e 100%)',
  'linear-gradient(135deg,#0a0a1a 0%,#1a1030 50%,#2a1060 100%)',
  'linear-gradient(135deg,#1a1208 0%,#2d1e0a 50%,#3d2a10 100%)',
  'linear-gradient(135deg,#0f0f0f 0%,#1a1a1a 50%,#1a0a1a 100%)',
  'linear-gradient(160deg,#001a0a 0%,#0a2010 50%,#0f3020 100%)',
]

const EMOJIS = ['🌧️','⚡','✨','🪞','🏛️','☕','💎','🔥','🌙','🎭','🌊','🎪']

function gradientForId(id: string): string {
  const idx = parseInt(id.slice(-4), 16) % GRADIENTS.length
  return GRADIENTS[idx]
}
function emojiForId(id: string): string {
  const idx = parseInt(id.slice(-2), 16) % EMOJIS.length
  return EMOJIS[idx]
}

interface PromptCardProps {
  prompt: Prompt
  onClick: (prompt: Prompt) => void
  priority?: boolean
}

export function PromptCard({ prompt, onClick, priority = false }: PromptCardProps) {
  const gradient = gradientForId(prompt.id)
  const emoji    = emojiForId(prompt.id)
  const topModels = prompt.ai_models.slice(0, 2)

  // PRIORITY 1: thumbnail_url = real pre-cropped image, always use this
  // PRIORITY 2: image_url plain (getStorageUrl, not optimized — free plan safe)
  const displayUrl = prompt.thumbnail_url
    || getStorageUrl(prompt.image_url)

  // Focal crop fallback (for prompts without thumbnail yet)
  const imgStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover',
    display: 'block',
    // If no thumbnail, use objectPosition as best-effort focal point
    ...(!prompt.thumbnail_url ? getCropImageStyle({
      crop_x: prompt.crop_x ?? null, crop_y: prompt.crop_y ?? null,
      crop_width: prompt.crop_width ?? null, crop_height: prompt.crop_height ?? null,
      crop_zoom: prompt.crop_zoom ?? null,
    }) : {}),
  }

  return (
    <div
      className="prompt-card"
      onClick={() => onClick(prompt)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(prompt)}
      aria-label={`View prompt: ${prompt.title}`}
    >
      <div className="card-media">
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={prompt.title}
            className="card-img"
            style={imgStyle}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <div className="card-gradient" style={{ background: gradient }}>
            <span className="card-emoji" aria-hidden="true">{emoji}</span>
          </div>
        )}

        {/* Always-visible bottom bar with title */}
        <div className="card-bar">
          <div className="card-bar-title">{prompt.title}</div>
          <div className="card-bar-meta">
            <div className="card-tag-row">
              {topModels.map((m) => {
                const cfg = AI_MODEL_CONFIG[m]
                return cfg ? (
                  <span key={m} className="card-tag"
                    style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}30` }}>
                    {cfg.label}
                  </span>
                ) : null
              })}
            </div>
            <div className="card-likes">
              <HeartIcon />
              {formatCount(prompt.likes)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeartIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 017.5 3c1.74 0 3.41.81 4.5 2.09A6.4 6.4 0 0116.5 3 5.5 5.5 0 0122 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}
