'use client'

// ============================================================
// MintPrompt — useInfiniteScroll Hook
// Fires a callback when a sentinel element enters the viewport.
// ============================================================

import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  onIntersect: () => void
  enabled?: boolean
  rootMargin?: string
  threshold?: number
}

/**
 * Attach this ref to a sentinel div at the bottom of the list.
 * When it scrolls into view, `onIntersect` is called.
 */
export function useInfiniteScroll({
  onIntersect,
  enabled = true,
  rootMargin = '200px',
  threshold = 0,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const stableCallback = useRef(onIntersect)

  useEffect(() => {
    stableCallback.current = onIntersect
  }, [onIntersect])

  const observe = useCallback(() => {
    const el = sentinelRef.current
    if (!el || !enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          stableCallback.current()
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, rootMargin, threshold])

  useEffect(() => {
    const cleanup = observe()
    return cleanup
  }, [observe])

  return { sentinelRef }
}
