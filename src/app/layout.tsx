// ============================================================
// MintPrompt — Root Layout
// ============================================================

import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import '@/styles/globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://mintprompt.vercel.app'),
  title: {
    default: 'MintPrompt — AI Aesthetic Prompt Discovery',
    template: '%s — MintPrompt',
  },
  description:
    'Browse curated AI image prompts for ChatGPT, Gemini, Grok, Midjourney & Flux. Copy prompts, discover Gen Z aesthetics, shop inspired looks.',
  keywords: ['AI prompts', 'aesthetic prompts', 'ChatGPT prompts', 'Midjourney prompts', 'AI art', 'prompt gallery'],
  authors: [{ name: 'MintPrompt' }],
  creator: 'MintPrompt',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'MintPrompt',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#080808',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
