-- ============================================================
-- MintPrompt — Supabase SQL Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;   -- for fast ILIKE search

-- ─── CATEGORIES ─────────────────────────────────────────────
create table if not exists public.categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  slug       text not null unique,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories_public_read"
  on public.categories for select using (true);

-- ─── PROMPTS ────────────────────────────────────────────────
create table if not exists public.prompts (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  slug            text not null unique,
  image_url       text,                        -- Supabase Storage public URL
  description     text,
  category_id     uuid references public.categories(id) on delete set null,
  tags            text[]   not null default '{}',
  ai_models       text[]   not null default '{}', -- ['chatgpt','gemini','grok','flux','mj']
  prompt_chatgpt  text,
  prompt_gemini   text,
  prompt_grok     text,
  negative_prompt text,
  views           int      not null default 0,
  likes           int      not null default 0,
  copy_count      int      not null default 0,
  published       boolean  not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.prompts enable row level security;

create policy "prompts_public_read"
  on public.prompts for select using (published = true);

-- Full-text search index (title + description + tags)
create index if not exists prompts_search_idx
  on public.prompts using gin (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || array_to_string(tags,' '))
  );

-- Trigram index for fast ILIKE
create index if not exists prompts_title_trgm_idx
  on public.prompts using gin (title gin_trgm_ops);

-- ─── AFFILIATE LINKS ────────────────────────────────────────
create table if not exists public.affiliate_links (
  id            uuid primary key default uuid_generate_v4(),
  prompt_id     uuid not null references public.prompts(id) on delete cascade,
  product_name  text not null,
  product_image text,
  affiliate_url text not null,
  platform      text not null check (platform in ('shopee','tiktok','tokopedia','lazada','other')),
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.affiliate_links enable row level security;

create policy "affiliate_links_public_read"
  on public.affiliate_links for select using (true);

-- ─── ANALYTICS EVENTS (lightweight, append-only) ────────────
create table if not exists public.analytics_events (
  id         bigserial primary key,
  prompt_id  uuid references public.prompts(id) on delete cascade,
  event_type text not null check (event_type in ('view','like','copy','affiliate_click')),
  ai_model   text,          -- which model was copied, if copy event
  metadata   jsonb,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

-- Public can INSERT events (views, copies, etc.)
create policy "analytics_public_insert"
  on public.analytics_events for insert with check (true);

-- Only authenticated admin can read analytics
create policy "analytics_admin_read"
  on public.analytics_events for select
  using (auth.role() = 'authenticated');

-- ─── FUNCTION: increment prompt counter atomically ──────────
create or replace function public.increment_prompt_counter(
  p_id    uuid,
  p_field text   -- 'views' | 'likes' | 'copy_count'
)
returns void
language plpgsql security definer as $$
begin
  if p_field = 'views' then
    update public.prompts set views = views + 1 where id = p_id;
  elsif p_field = 'likes' then
    update public.prompts set likes = likes + 1 where id = p_id;
  elsif p_field = 'copy_count' then
    update public.prompts set copy_count = copy_count + 1 where id = p_id;
  end if;
end;
$$;

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger prompts_updated_at
  before update on public.prompts
  for each row execute function public.handle_updated_at();

-- ─── SEED: default categories ────────────────────────────────
insert into public.categories (name, slug, sort_order) values
  ('All',             'all',          0),
  ('Mirror Selfie',   'mirror-selfie',1),
  ('Old Money',       'old-money',    2),
  ('Cyberpunk',       'cyberpunk',    3),
  ('Streetwear',      'streetwear',   4),
  ('Anime Realistic', 'anime',        5),
  ('Cinematic',       'cinematic',    6),
  ('Fashion',         'fashion',      7),
  ('Luxury',          'luxury',       8),
  ('Cafe',            'cafe',         9),
  ('Tokyo Rain',      'tokyo-rain',   10)
on conflict (slug) do nothing;
