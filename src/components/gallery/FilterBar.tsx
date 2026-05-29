'use client'

// ============================================================
// MintPrompt — FilterBar
// Category and AI model filter chips.
// ============================================================

import { useCategories } from '@/hooks/useCategories'
import type { Category, AIModel } from '@/types/database'

const AI_MODELS: Array<{ id: AIModel; label: string; color: string }> = [
  { id: 'chatgpt', label: 'ChatGPT',    color: '#10a37f' },
  { id: 'gemini',  label: 'Gemini',     color: '#5ba8ff' },
  { id: 'grok',    label: 'Grok',       color: '#9b6bff' },
  { id: 'flux',    label: 'Flux',       color: '#ff6b9d' },
  { id: 'mj',      label: 'Midjourney', color: '#ff8c42' },
]

interface FilterBarProps {
  selectedCategory: string
  selectedAIModel: AIModel | 'all'
  onCategoryChange: (slug: string) => void
  onAIModelChange: (model: AIModel | 'all') => void
  initialCategories?: Category[]
}

export function FilterBar({
  selectedCategory,
  selectedAIModel,
  onCategoryChange,
  onAIModelChange,
  initialCategories,
}: FilterBarProps) {
  const { categories, isLoading } = useCategories(initialCategories)

  return (
    <div className="filter-bar">
      {/* Category row */}
      <div className="filter-row">
        <span className="filter-label">Category</span>
        <div className="chip-scroll">
          <button
            className={`chip ${selectedCategory === 'all' ? 'chip-active' : ''}`}
            onClick={() => onCategoryChange('all')}
          >
            All
          </button>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="chip-skeleton" aria-hidden="true" />
              ))
            : categories
                .filter((c) => c.slug !== 'all')
                .map((cat) => (
                  <button
                    key={cat.id}
                    className={`chip ${selectedCategory === cat.slug ? 'chip-active' : ''}`}
                    onClick={() => onCategoryChange(cat.slug)}
                  >
                    {cat.name}
                  </button>
                ))}
        </div>
      </div>

      {/* AI model row */}
      <div className="filter-row">
        <span className="filter-label">AI Model</span>
        <div className="chip-scroll">
          <button
            className={`chip ${selectedAIModel === 'all' ? 'chip-active' : ''}`}
            onClick={() => onAIModelChange('all')}
          >
            All Models
          </button>
          {AI_MODELS.map((m) => (
            <button
              key={m.id}
              className={`chip ${selectedAIModel === m.id ? 'chip-ai-active' : ''}`}
              style={
                selectedAIModel === m.id
                  ? { color: m.color, borderColor: `${m.color}40`, background: `${m.color}15` }
                  : { color: m.color, borderColor: `${m.color}25` }
              }
              onClick={() => onAIModelChange(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
