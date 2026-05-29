-- Add thumbnail_url column to prompts table
-- thumbnail_url = real cropped image generated at upload time
-- image_url = original full image (kept for detail page)
alter table public.prompts
  add column if not exists thumbnail_url text;

comment on column public.prompts.thumbnail_url is 
  'Pre-cropped thumbnail generated at upload/crop time. Used in gallery cards.';
