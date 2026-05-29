-- ============================================================
-- MintPrompt — Supabase Storage Setup
-- Run this in the Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- Create the prompt-images storage bucket (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'prompt-images',
  'prompt-images',
  true,
  10485760,   -- 10 MB per file
  array['image/jpeg','image/png','image/webp','image/gif','image/avif']
)
on conflict (id) do nothing;

-- Allow public read of all images
create policy "prompt_images_public_read"
  on storage.objects for select
  using (bucket_id = 'prompt-images');

-- Only authenticated admins can upload
create policy "prompt_images_admin_upload"
  on storage.objects for insert
  with check (
    bucket_id = 'prompt-images'
    and auth.role() = 'authenticated'
  );

-- Only authenticated admins can update/delete
create policy "prompt_images_admin_update"
  on storage.objects for update
  using (
    bucket_id = 'prompt-images'
    and auth.role() = 'authenticated'
  );

create policy "prompt_images_admin_delete"
  on storage.objects for delete
  using (
    bucket_id = 'prompt-images'
    and auth.role() = 'authenticated'
  );

-- ─── PRODUCT IMAGES BUCKET (affiliate thumbnails) ────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,    -- 5 MB
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do nothing;

create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_admin_upload"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );
