// ============================================================
// MintPrompt — Category Fetching (DEMO / MOCK MODE)
// Serves data from local mock file — no Supabase required.
// ============================================================

import { MOCK_CATEGORIES } from '../../../mock/categories'
import type { Category } from '@/types/database'

export async function fetchCategoriesPublic(): Promise<Category[]> {
  return MOCK_CATEGORIES
}
