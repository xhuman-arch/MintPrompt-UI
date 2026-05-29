// ============================================================
// MintPrompt — General Utilities
// ============================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely (shadcn/ui standard). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format large numbers: 14200 → "14.2k" */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

/** Truncate text to a given character limit with ellipsis. */
export function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text
  return text.slice(0, limit).trimEnd() + '…'
}

/** Slugify a string: "My Cool Prompt" → "my-cool-prompt" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/** Copy text to clipboard, returns true on success. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    // Fallback for older browsers
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}

/** AI model display config */
export const AI_MODEL_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  chatgpt:  { label: 'ChatGPT',    color: '#10a37f', bg: '#10a37f18' },
  gemini:   { label: 'Gemini',     color: '#5ba8ff', bg: '#5ba8ff18' },
  grok:     { label: 'Grok',       color: '#9b6bff', bg: '#9b6bff18' },
  flux:     { label: 'Flux',       color: '#ff6b9d', bg: '#ff6b9d18' },
  mj:       { label: 'Midjourney', color: '#ff8c42', bg: '#ff8c4218' },
}

/** Platform display config */
export const PLATFORM_CONFIG: Record<string, { label: string; color: string; cta: string }> = {
  shopee:    { label: 'Shopee',      color: '#ff5722', cta: 'Buy on Shopee' },
  tiktok:    { label: 'TikTok Shop', color: '#ff0050', cta: 'Shop on TikTok' },
  tokopedia: { label: 'Tokopedia',   color: '#42b549', cta: 'View on Tokopedia' },
  lazada:    { label: 'Lazada',      color: '#f5476b', cta: 'Shop on Lazada' },
  other:     { label: 'Shop',        color: '#a8e03a', cta: 'Get the Look' },
}

/** Debounce a function. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}
