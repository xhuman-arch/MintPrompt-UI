'use client'

// ============================================================
// MintPrompt — Homepage (Gallery)
// Wires together: Navbar, HeroSection, FilterBar, GalleryGrid,
// PromptDetailPanel — all driven by real Supabase data.
// ============================================================

import { useState, useCallback } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { HeroSection, type HeroStats } from '@/components/layout/HeroSection'
import { Footer } from '@/components/layout/Footer'
import { FilterBar } from '@/components/gallery/FilterBar'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { PromptDetailPanel } from '@/components/prompt/PromptDetailPanel'
import { usePrompts } from '@/hooks/usePrompts'
import type { Prompt, Category, AIModel } from '@/types/database'

interface HomeClientProps {
  initialPrompts: Prompt[]
  initialCount: number
  initialCategories: Category[]
  heroStats: HeroStats
  /** When set, the detail panel opens immediately (deep-link from /prompt/[slug]) */
  initialOpenSlug?: string
}

export function HomeClient({ initialPrompts, initialCount, initialCategories, heroStats, initialOpenSlug }: HomeClientProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(initialOpenSlug ?? null)

  const {
    prompts,
    state,
    error,
    hasMore,
    loadMore,
    category,
    setCategory,
    aiModel,
    setAiModel,
    search,
    setSearch,
  } = usePrompts({ initialData: initialPrompts, initialCount })

  const handlePromptClick = useCallback((prompt: Prompt) => {
    setOpenSlug(prompt.slug)
    // Update URL without full navigation for shareability
    window.history.replaceState(null, '', `/prompt/${prompt.slug}`)
  }, [])

  const handlePanelClose = useCallback(() => {
    setOpenSlug(null)
    window.history.replaceState(null, '', '/')
  }, [])

  const handleRelatedClick = useCallback((prompt: Prompt) => {
    setOpenSlug(prompt.slug)
    window.history.replaceState(null, '', `/prompt/${prompt.slug}`)
  }, [])

  const handleCategoryChange = useCallback((slug: string) => {
    setCategory(slug)
  }, [setCategory])

  const handleAIModelChange = useCallback((model: AIModel | 'all') => {
    setAiModel(model)
  }, [setAiModel])

  return (
    <>
      <Navbar search={search} onSearchChange={setSearch} />

      <main id="main-content">
        <HeroSection stats={heroStats} />

        <FilterBar
          selectedCategory={category}
          selectedAIModel={aiModel}
          onCategoryChange={handleCategoryChange}
          onAIModelChange={handleAIModelChange}
          initialCategories={initialCategories}
        />

        <GalleryGrid
          prompts={prompts}
          isLoading={state === 'loading'}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onPromptClick={handlePromptClick}
          error={error}
        />
      </main>

      <Footer />

      <PromptDetailPanel
        slug={openSlug}
        onClose={handlePanelClose}
        onRelatedClick={handleRelatedClick}
      />
    </>
  )
}
