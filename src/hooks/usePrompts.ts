'use client'

// ============================================================
// MintPrompt — usePrompts Hook
// Handles fetching, filtering, searching, and infinite scroll.
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchPrompts } from '@/lib/api/prompts.client'
import { debounce } from '@/lib/utils'
import type { Prompt, PromptsQuery, AIModel } from '@/types/database'

type LoadingState = 'idle' | 'loading' | 'success' | 'error'

interface UsePromptsOptions {
  initialData?: Prompt[]
  initialCount?: number
}

export function usePrompts(opts: UsePromptsOptions = {}) {
  const deduped = opts.initialData
    ? opts.initialData.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i)
    : []
  const [prompts, setPrompts] = useState<Prompt[]>(deduped)
  const [state, setState] = useState<LoadingState>(opts.initialData ? 'success' : 'idle')
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(
    opts.initialCount !== undefined
      ? (opts.initialData?.length ?? 0) < opts.initialCount
      : true
  )
  const [page, setPage] = useState(1)

  const [category, setCategory] = useState<string>('all')
  const [aiModel, setAiModel] = useState<AIModel | 'all'>('all')
  const [search, setSearch] = useState('')

  const isLoadingMore = useRef(false)
  // Flag to skip the initial effect run when initialData is provided
  const isFirstRun = useRef(true)

  const load = useCallback(async (query: PromptsQuery, append = false) => {
    if (isLoadingMore.current && append) return
    isLoadingMore.current = true
    setState('loading')
    setError(null)

    try {
      const res = await fetchPrompts(query)
      setPrompts(prev => {
        if (!append) return res.data
        // Deduplicate by ID — prevents duplicates from race conditions or double-fetch
        const existingIds = new Set(prev.map(p => p.id))
        const newItems = res.data.filter(p => !existingIds.has(p.id))
        return [...prev, ...newItems]
      })
      setHasMore(res.hasMore)
      setPage(res.page)
      setState('success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load prompts'
      setError(msg)
      setState('error')
    } finally {
      isLoadingMore.current = false
    }
  }, [])

  // Stable debounced loader
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLoad = useCallback(
    debounce((q: PromptsQuery) => load(q, false), 350),
    [load]
  )

  // Re-fetch when filters change; skip on first render if we have initialData
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      if (opts.initialData && opts.initialData.length > 0) return
    }

    const query: PromptsQuery = { category, aiModel, search, page: 1 }
    setPage(1)

    if (search) {
      debouncedLoad(query)
    } else {
      load(query, false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, aiModel, search])

  /** Load the next page (called by infinite scroll sentinel). */
  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore.current) return
    const nextPage = page + 1
    const query: PromptsQuery = { category, aiModel, search, page: nextPage }
    load(query, true)
  }, [hasMore, page, category, aiModel, search, load])

  return {
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
    isLoading: state === 'loading',
  }
}
