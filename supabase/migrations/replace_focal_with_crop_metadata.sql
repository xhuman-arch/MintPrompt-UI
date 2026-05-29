-- ============================================================
-- MintPrompt — Migration: Replace focal positioning with crop metadata
-- Run this against your Supabase database AFTER the previous migration.
-- ============================================================

-- ─── Drop old focal columns (if they exist) ──────────────────
alter table public.prompts
  drop column if exists image_position_x,
  drop column if exists image_position_y,
  drop column if exists image_zoom;

-- ─── Add crop metadata columns ───────────────────────────────
-- All values are percentages (0–100) of the natural image dimensions.
-- Matches react-easy-crop's croppedAreaPercentage output exactly.
-- NULL = no crop set → frontend uses object-fit: cover with center.
alter table public.prompts
  add column if not exists crop_x      numeric(6,3),  -- % from left  (nullable)
  add column if not exists crop_y      numeric(6,3),  -- % from top   (nullable)
  add column if not exists crop_width  numeric(6,3),  -- % of width   (nullable)
  add column if not exists crop_height numeric(6,3),  -- % of height  (nullable)
  add column if not exists crop_zoom   numeric(4,2);  -- zoom 1.0–3.0 (nullable)

comment on column public.prompts.crop_x      is 'react-easy-crop croppedAreaPercentage.x — % offset from left';
comment on column public.prompts.crop_y      is 'react-easy-crop croppedAreaPercentage.y — % offset from top';
comment on column public.prompts.crop_width  is 'react-easy-crop croppedAreaPercentage.width — % of image width';
comment on column public.prompts.crop_height is 'react-easy-crop croppedAreaPercentage.height — % of image height';
comment on column public.prompts.crop_zoom   is 'Zoom level used in the cropper (1.0–3.0)';
