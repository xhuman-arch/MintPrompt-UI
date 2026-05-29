// ============================================================
// MintPrompt — Mock Categories Data (Demo Mode)
// Replace with real Supabase data in production.
// ============================================================

import type { Category } from '@/types/database'

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Aesthetic', slug: 'aesthetic', sort_order: 1, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-2', name: 'Dark Academia', slug: 'dark-academia', sort_order: 2, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-3', name: 'Cottagecore', slug: 'cottagecore', sort_order: 3, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-4', name: 'Cyberpunk', slug: 'cyberpunk', sort_order: 4, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-5', name: 'Minimal', slug: 'minimal', sort_order: 5, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-6', name: 'Fantasy', slug: 'fantasy', sort_order: 6, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-7', name: 'Streetwear', slug: 'streetwear', sort_order: 7, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-8', name: 'Nature', slug: 'nature', sort_order: 8, created_at: '2024-01-01T00:00:00Z' },
]
