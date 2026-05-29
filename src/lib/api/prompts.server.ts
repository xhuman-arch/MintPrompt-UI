// ============================================================
// MintPrompt — Prompt Fetching Server (DEMO / MOCK MODE)
// ============================================================

export {
  fetchPromptsPublic as fetchPromptsServer,
  fetchPromptBySlugPublic as fetchPromptBySlugServer,
  fetchHeroStatsPublic as fetchHeroStats,
  fetchHeroStatsPublic,
} from './prompts.public'

export type HeroStats = {
  totalPrompts: number
  totalViews: number
  totalCopies: number
}
