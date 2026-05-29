-- ============================================================
-- MintPrompt — Seed Data (optional, for local dev / testing)
-- Run AFTER schema.sql and storage.sql
-- ============================================================

-- Insert sample prompts (published=true so they appear publicly)
-- image_url can be left null; the frontend will show a placeholder gradient

with cat as (select id, slug from public.categories)
insert into public.prompts (
  title, slug, image_url, description, category_id,
  tags, ai_models,
  prompt_chatgpt, prompt_gemini, prompt_grok,
  negative_prompt, views, likes, published
)
values
(
  'Tokyo Rainy Night',
  'tokyo-rainy-night',
  null,
  'A melancholic Gen Z figure in a neon-lit Tokyo alley, rain-soaked jacket, bokeh streetlights',
  (select id from cat where slug='tokyo-rain'),
  array['Cinematic','Dark','Moody'],
  array['chatgpt','grok'],
  'Cinematic portrait of a young Asian woman standing alone in a narrow Tokyo alley at night, heavy rain creating mirror-like reflections on wet cobblestones, oversized black puffer jacket glistening, neon signs in Japanese reflect pink and cyan in puddles, shallow depth of field, dramatic side lighting, film grain, 35mm photography style, moody atmosphere, 4k',
  'Dark cinematic photography: lone figure in Tokyo rain at night, neon bokeh lights blurred behind, wet streets reflecting red and blue neon, studio Ghibli meets Christopher Nolan aesthetic, emotional and quiet, ultra detailed, photorealistic',
  'Hyperrealistic photograph, Tokyo side street midnight rain, Gen Z female protagonist, vintage Harajuku streetwear, cinematic color grade, neon reflections on water, f/1.4 lens bokeh, quiet melancholy, 8k resolution',
  'cartoonish, bright colors, daytime, happy, crowded, noise, blurry subject',
  14200, 2840, true
),
(
  'Old Money Estate',
  'old-money-estate',
  null,
  'Timeless preppy aesthetic — polo fields, cashmere, inherited wealth visual storytelling',
  (select id from cat where slug='old-money'),
  array['Old Money','Elegant','Editorial'],
  array['chatgpt','gemini'],
  'Editorial fashion photography, old money aesthetic, young man in tailored camel coat and cream turtleneck standing in a grand library with floor-to-ceiling mahogany bookshelves, warm amber lighting, Persian rugs, silver-framed portraits, Ivy League atmosphere, film photo look, muted warm palette, 4k',
  'Luxury lifestyle portrait, old money European estate, subject wearing heritage tweed jacket and wool trousers, overcast English countryside background, golden hour, equestrian atmosphere, desaturated film look, elegant and quiet wealth',
  'Old money aesthetic fashion shoot, subject in Ralph Lauren-style clothing, grand interior architecture, warm candlelight, antique furniture, subtle wealth signaling, analog film grain, editorial magazine quality',
  'streetwear, logos, bright neon, modern tech, casual, flashy jewelry',
  22100, 4100, true
),
(
  'Cyberpunk Neon City',
  'cyberpunk-neon-city',
  null,
  'Dystopian megacity, glowing implants, acid rain, neon advertisements in the dark future',
  (select id from cat where slug='cyberpunk'),
  array['Cyberpunk','Futuristic','Neon'],
  array['grok','flux'],
  'Cyberpunk megacity street level at night, acid rain, protagonist with bioluminescent tattoos and chrome cybernetic arm, dense advertising holograms in Chinese and English, flying vehicles in the distance, blade runner aesthetic, ultra detailed, 8k, cinematic lighting',
  'Futuristic dystopian cityscape, neon-soaked alley in 2087, diverse crowd in techwear, holographic advertisements in multiple languages, rain-slicked surfaces reflecting cyan and magenta, Blade Runner 2049 color palette, photorealistic render',
  'Cyberpunk character portrait, augmented human with glowing red cybernetic eye, neon city background, techwear outfit with RGB accents, hyperdetailed, cinematic composition, chromatic aberration, film grain, dark atmosphere',
  'clean, bright, natural, pastoral, vintage, retro, warm tones',
  31800, 6200, true
),
(
  'Mirror Selfie Aesthetic',
  'mirror-selfie-aesthetic',
  null,
  'Perfect Gen Z mirror selfie with moody bedroom lighting and streetwear aesthetic',
  (select id from cat where slug='mirror-selfie'),
  array['Mirror','OOTD','Gen Z'],
  array['chatgpt','gemini'],
  'Instagram-style mirror selfie, young woman in aesthetic bedroom with fairy lights and film posters, oversized graphic tee, baggy cargo pants, chunky sneakers, vintage camera in hand, moody warm lighting, slightly grainy digital photo feel, authentic Gen Z aesthetic',
  'Mirror selfie portrait, soft aesthetic bedroom setting, golden hour light through curtains, subject wearing oversized hoodie and high-waisted jeans, natural makeup, authentic and candid feel, warm film photography aesthetic',
  'Gen Z mirror selfie, full length bathroom mirror, minimal clean aesthetic, subject in streetwear OOTD, slightly overexposed, warm tones, authentic not overly edited, film grain, natural',
  'professional studio, heavy editing, filters, artificial, posed, stiff, commercial',
  18500, 3700, true
),
(
  'Anime Realistic Portrait',
  'anime-realistic-portrait',
  null,
  'Semi-realistic anime art style — between illustration and photography',
  (select id from cat where slug='anime'),
  array['Anime','Semi-Real','Pastel'],
  array['gemini','flux','mj'],
  'Anime girl with realistic skin textures, large expressive eyes with detailed iris reflections, soft gradient hair in pastel lavender, wearing school uniform, cherry blossom petals floating, warm afternoon light, between photorealistic and anime art style, 4k detailed',
  'Hyperrealistic anime portrait, Japanese girl, pastel aesthetic, golden hour bokeh background, skin pores visible, anime-proportioned eyes with photorealistic reflection detail, ultra sharp render, Studio Ghibli meets photorealism',
  'Semi-realistic anime character portrait, girl in oversized varsity jacket, city street background, anime shading on realistic proportions, vivid color grading, 8k, trending on ArtStation',
  'fully realistic photography, cartoon only, chibi, western cartoon, low detail, flat shading',
  45200, 9100, true
);

-- Seed affiliate links for Tokyo Rainy Night
with p as (select id from public.prompts where slug='tokyo-rainy-night')
insert into public.affiliate_links (prompt_id, product_name, affiliate_url, platform, sort_order)
values
  ((select id from p), 'Rain Jacket',    'https://shopee.co.id', 'shopee',  1),
  ((select id from p), 'Platform Boots', 'https://tiktok.com',   'tiktok',  2),
  ((select id from p), 'Vintage Bag',    'https://shopee.co.id', 'shopee',  3),
  ((select id from p), 'Neon Tote',      'https://tiktok.com',   'tiktok',  4);

-- Seed affiliate links for Old Money Estate
with p as (select id from public.prompts where slug='old-money-estate')
insert into public.affiliate_links (prompt_id, product_name, affiliate_url, platform, sort_order)
values
  ((select id from p), 'Camel Coat',  'https://shopee.co.id', 'shopee', 1),
  ((select id from p), 'Loafers',     'https://tiktok.com',   'tiktok', 2),
  ((select id from p), 'Luxury Watch','https://shopee.co.id', 'shopee', 3),
  ((select id from p), 'Wool Scarf',  'https://tiktok.com',   'tiktok', 4);

-- Seed affiliate links for Cyberpunk Neon City
with p as (select id from public.prompts where slug='cyberpunk-neon-city')
insert into public.affiliate_links (prompt_id, product_name, affiliate_url, platform, sort_order)
values
  ((select id from p), 'Techwear Jacket', 'https://tiktok.com',   'tiktok', 1),
  ((select id from p), 'Cyber Boots',     'https://shopee.co.id', 'shopee', 2),
  ((select id from p), 'LED Accessories', 'https://tiktok.com',   'tiktok', 3),
  ((select id from p), 'Face Mask',       'https://shopee.co.id', 'shopee', 4);
