-- Fix crop column sizes — numeric(6,3) was too small for
-- react-easy-crop values which can be negative or > 100.
alter table public.prompts
  alter column crop_x      type numeric(8,3),
  alter column crop_y      type numeric(8,3),
  alter column crop_width  type numeric(8,3),
  alter column crop_height type numeric(8,3),
  alter column crop_zoom   type numeric(6,3);
