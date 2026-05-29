# MintPrompt 🌿

**AI Aesthetic Prompt Discovery Platform**

Browse and copy curated AI image prompts for ChatGPT, Gemini, Grok, Midjourney & Flux. Discover aesthetic visuals and shop inspired looks.

> ⚠️ **This is a public showcase / demo version.** All backend functionality uses local mock data. No Supabase connection or real credentials are required to run locally.

---

## Features

- 🖼️ Prompt gallery with infinite scroll
- 🔍 Filter by AI model and category
- 📋 One-click prompt copy
- 🔗 Affiliate product showcase
- 🌙 Dark aesthetic UI
- 📱 Fully responsive
- 🔒 Admin dashboard (demo mode — read-only mock data)

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mintprompt.git
cd mintprompt

# 2. Install dependencies
npm install

# 3. Create environment file (optional — not required for demo mode)
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Mode

This showcase version runs entirely on **local mock data** — no Supabase account needed.

| Feature | Demo Mode | Production Mode |
|---|---|---|
| Prompt gallery | ✅ Mock data | ✅ Live Supabase |
| Category filters | ✅ Mock data | ✅ Live Supabase |
| Prompt detail panel | ✅ Mock data | ✅ Live Supabase |
| Copy prompts | ✅ Clipboard | ✅ Clipboard |
| Admin dashboard | ✅ Read-only demo | ✅ Full CRUD |
| Analytics tracking | ❌ No-op | ✅ Supabase DB |
| Image uploads | ❌ Disabled | ✅ Supabase Storage |
| Authentication | ❌ Bypassed | ✅ Supabase Auth |

---

## Connecting a Real Supabase Project

To enable full functionality:

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema from `supabase/schema.sql` in the SQL editor
3. Apply migrations from `supabase/migrations/`
4. Fill in `.env.local` with your project credentials from `.env.example`
5. The app will automatically switch from mock data to live data

---

## Project Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── admin/         # Admin dashboard (demo: read-only)
│   ├── api/           # API routes (demo: mock responses)
│   └── prompt/        # Prompt detail pages
├── components/        # UI components
│   ├── gallery/       # Gallery grid, filter bar, prompt cards
│   ├── layout/        # Navbar, hero, footer
│   └── prompt/        # Prompt detail panel
├── hooks/             # React hooks (usePrompts, useCategories)
├── lib/               # Utilities and API clients
│   ├── api/           # Data fetching (demo: reads from /mock)
│   └── supabase/      # Supabase client stubs (demo mode)
└── types/             # TypeScript types
mock/
├── prompts.ts         # 12 demo prompts with full data
└── categories.ts      # 8 demo categories
supabase/
├── schema.sql         # Full database schema
└── migrations/        # Schema migrations
```

---

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (production mode)

---

## What Was Changed for the Public Showcase

The following changes were made to make this safe for open-source sharing:

**Removed:**
- All real Supabase credentials and service role keys
- Production database write operations
- Real authentication / admin guard
- Analytics event tracking (replaced with no-ops)
- Storage upload functionality

**Replaced with:**
- `mock/prompts.ts` — 12 realistic demo prompts
- `mock/categories.ts` — 8 demo categories
- Mock API layer in `src/lib/api/*.ts` — reads from local mock files
- Demo middleware — bypasses auth checks
- No-op analytics — tracking functions exist but do nothing
- Demo admin login — enter the dashboard without credentials

**Preserved:**
- All UI components, layouts, and styling
- Gallery, filter, search, and infinite scroll functionality
- Prompt detail panel with tabs and copy buttons
- Admin dashboard UI (read-only with mock data)
- Full TypeScript types and project structure

---

## License

MIT
