'use client'

// ============================================================
// MintPrompt — GalleryGrid
// Masonry grid with infinite scroll and skeleton loading.
// ============================================================

import { useCallback } from 'react'
import { PromptCard } from './PromptCard'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import type { Prompt } from '@/types/database'

interface GalleryGridProps {
  prompts: Prompt[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
  onPromptClick: (prompt: Prompt) => void
  error?: string | null
}

export function GalleryGrid({
  prompts,
  isLoading,
  hasMore,
  onLoadMore,
  onPromptClick,
  error,
}: GalleryGridProps) {
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) onLoadMore()
  }, [isLoading, hasMore, onLoadMore])

  const { sentinelRef } = useInfiniteScroll({
    onIntersect: handleLoadMore,
    enabled: hasMore && !isLoading,
  })

  // Error state
  if (error) {
    return (
      <div className="gallery-error">
        <p>Something went wrong loading prompts.</p>
        <p className="gallery-error-detail">{error}</p>
      </div>
    )
  }

  // Initial loading — show skeleton grid
  if (isLoading && prompts.length === 0) {
    return (
      <div className="gallery-wrap">
        <div className="masonry-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={`sk-${i}`} index={i} />
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (!isLoading && prompts.length === 0) {
    return (
      <div className="gallery-empty">
        <div className="gallery-empty-icon">✦</div>
        <p>No prompts found</p>
        <p className="gallery-empty-sub">Try a different category or search term</p>
      </div>
    )
  }

  return (
    <div className="gallery-wrap">
      <div className="masonry-grid">
        {prompts.map((prompt, i) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onClick={onPromptClick}
            priority={i < 8}
          />
        ))}
      </div>

      {/* Sentinel for infinite scroll — sits below the grid */}
      <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />

      {/* Spinner for loading more pages */}
      {isLoading && prompts.length > 0 && (
        <div className="loading-row" aria-label="Loading more prompts">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
      )}

      {!hasMore && prompts.length > 0 && (
        <p className="gallery-end-msg">You&apos;ve seen all prompts ✦</p>
      )}
    </div>
  )
}

function SkeletonCard({ index }: { index: number }) {
  const heights = [220, 280, 240, 300, 200, 260, 240, 200, 280, 220, 300, 240]
  const h = heights[index % heights.length]

  return (
    <div className="skeleton-card" style={{ height: h }} aria-hidden="true">
      <div className="skeleton-shimmer" />
    </div>
  )
}
