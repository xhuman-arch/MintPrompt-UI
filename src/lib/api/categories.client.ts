// ============================================================
// MintPrompt — Category Fetching (BROWSER / DEMO MODE)
// ============================================================

import { MOCK_CATEGORIES } from '../../../mock/categories'
import type { Category } from '@/types/database'

export async function fetchCategories(): Promise<Category[]> {
  return MOCK_CATEGORIES
}
