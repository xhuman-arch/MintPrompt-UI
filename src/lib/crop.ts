// ============================================================
// MintPrompt — Crop Utility (v5 — definitive)
//
// STORAGE:
//   crop_x    = focal centre X, % of natural image width  (0-100)
//   crop_y    = focal centre Y, % of natural image height (0-100)
//   crop_zoom = unused on frontend (kept for DB compat)
//
// FRONTEND RENDER:
//   img { position:absolute; inset:0; width:100%; height:100%;
//         object-fit:cover; object-position: ${crop_x}% ${crop_y}% }
//   parent must have { position:relative; overflow:hidden }
//
// No transform/scale ever. objectFit:cover fills the container,
// objectPosition moves the focal point into view. Simple. Correct.
// ============================================================

export interface CropMeta {
  crop_x:      number | null
  crop_y:      number | null
  crop_width:  number | null   // unused
  crop_height: number | null   // unused
  crop_zoom:   number | null   // unused on frontend
}

export function getCropImageStyle(crop: CropMeta): React.CSSProperties {
  const fx = (crop.crop_x != null) ? Math.max(0, Math.min(100, crop.crop_x)) : 50
  const fy = (crop.crop_y != null) ? Math.max(0, Math.min(100, crop.crop_y)) : 20

  return {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: `${fx}% ${fy}%`,
    display: 'block',
  }
}

// Keep getCropStyles for backward compat with DetailPanel
export function getCropStyles(
  crop: CropMeta,
  _aspect?: number
): { containerStyle: React.CSSProperties; imageStyle: React.CSSProperties } {
  return {
    containerStyle: { position: 'relative', overflow: 'hidden' },
    imageStyle: getCropImageStyle(crop),
  }
}

export function clampCrop(v: {
  crop_x: number; crop_y: number; crop_zoom: number
}) {
  const c = (n: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, parseFloat(n.toFixed(3))))
  return {
    crop_x:      c(v.crop_x,    0, 100),
    crop_y:      c(v.crop_y,    0, 100),
    crop_width:  0,
    crop_height: 0,
    crop_zoom:   c(v.crop_zoom, 1, 3),
  }
}

export function hasCrop(crop: CropMeta): boolean {
  return crop.crop_x != null && crop.crop_y != null
}
