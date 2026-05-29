'use client'

// ============================================================
// MintPrompt — useCategories Hook
// ============================================================

import { useState, useEffect } from 'react'
import { fetchCategories } from '@/lib/api/categories.client'
import type { Category } from '@/types/database'

type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Simple in-memory cache — categories rarely change
let cachedCategories: Category[] | null = null

export function useCategories(initialData?: Category[]) {
  const [categories, setCategories] = useState<Category[]>(
    initialData ?? cachedCategories ?? []
  )
  const [state, setState] = useState<LoadingState>(
    initialData || cachedCategories ? 'success' : 'idle'
  )

  useEffect(() => {
    if (cachedCategories) {
      setCategories(cachedCategories)
      setState('success')
      return
    }

    setState('loading')
    fetchCategories()
      .then((cats) => {
        cachedCategories = cats
        setCategories(cats)
        setState('success')
      })
      .catch(() => setState('error'))
  }, [])

  return { categories, isLoading: state === 'loading' }
}
