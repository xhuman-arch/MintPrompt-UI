-- ============================================================
-- MintPrompt — Migration: Image Focal Positioning + Affiliate CTA
-- Run this against your Supabase database.
-- ============================================================

-- ─── Image focal positioning fields on prompts ───────────────
alter table public.prompts
  add column if not exists image_position_x numeric(5,2) not null default 50,
  add column if not exists image_position_y numeric(5,2) not null default 50,
  add column if not exists image_zoom       numeric(4,2) not null default 1.0;

comment on column public.prompts.image_position_x is 'Horizontal focal point 0–100 (maps to CSS object-position x)';
comment on column public.prompts.image_position_y is 'Vertical focal point 0–100 (maps to CSS object-position y)';
comment on column public.prompts.image_zoom       is 'Image zoom scale 1.0–2.0 (maps to CSS transform: scale())';

-- ─── Affiliate links: add cta_label field ────────────────────
alter table public.affiliate_links
  add column if not exists cta_label text;

comment on column public.affiliate_links.cta_label is 'Optional CTA button label override (e.g. "Get the Look")';
