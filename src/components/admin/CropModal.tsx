'use client'
// ============================================================
// MintPrompt — CropModal (v6 — browser Canvas thumbnail)
//
// Generates a real cropped WebP thumbnail entirely in the browser
// using the Canvas API — no native packages, works on all platforms.
//
// Flow:
//  1. Admin crops with react-easy-crop
//  2. "Apply Crop" → Canvas.drawImage crops the image in browser
//  3. canvas.toBlob() → upload to Supabase Storage via /api/admin/upload
//  4. thumbnail_url saved to DB
//  5. Frontend uses thumbnail_url directly — pixel-perfect WYSIWYG
// ============================================================

import { useState, useCallback, useEffect, useRef } from 'react'
import Cropper from 'react-easy-crop'
import type { Area, Point } from 'react-easy-crop'

export interface SavedCrop {
  crop_x: number; crop_y: number
  crop_width: number; crop_height: number; crop_zoom: number
  thumbnail_url: string
}

interface Props {
  imageUrl: string
  initialCrop?: Omit<SavedCrop, 'thumbnail_url'> & { thumbnail_url?: string } | null
  onSave: (crop: SavedCrop) => void
  onCancel: () => void
}

// Output thumbnail size — 3:4 portrait, good for gallery cards
const THUMB_W = 600
const THUMB_H = 800

/**
 * Generate a real cropped thumbnail using browser Canvas API.
 * Returns a Blob of the cropped image as WebP (fallback: JPEG).
 */
async function generateThumbnailBlob(
  imageUrl: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width  = THUMB_W
      canvas.height = THUMB_H
      const ctx = canvas.getContext('2d')!

      ctx.drawImage(
        img,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, THUMB_W, THUMB_H,
      )

      // Try WebP first, fallback to JPEG
      canvas.toBlob(
        blob => {
          if (blob) { resolve(blob); return }
          // WebP not supported — fallback to JPEG
          canvas.toBlob(
            blob2 => blob2 ? resolve(blob2) : reject(new Error('Canvas toBlob failed')),
            'image/jpeg', 0.88
          )
        },
        'image/webp', 0.88
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageUrl
  })
}

export function CropModal({ imageUrl, initialCrop, onSave, onCancel }: Props) {
  const [cropPos, setCropPos] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom]       = useState(initialCrop?.crop_zoom ?? 1)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [progress, setProgress] = useState('')

  // Refs — synchronous access at save time, no stale closures
  const naturalW   = useRef(0)
  const naturalH   = useRef(0)
  const pixelCropR = useRef<Area | null>(null)

  const [focalX, setFocalX]   = useState(initialCrop?.crop_x ?? 50)
  const [focalY, setFocalY]   = useState(initialCrop?.crop_y ?? 50)
  const [sizeLabel, setSizeLabel] = useState('')

  // Load natural image size once
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      naturalW.current = img.naturalWidth
      naturalH.current = img.naturalHeight
      setSizeLabel(`${img.naturalWidth} × ${img.naturalHeight}px`)
    }
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
  }, [imageUrl])

  const onCropComplete = useCallback((_: Area, pxCrop: Area) => {
    pixelCropR.current = pxCrop
    const w = naturalW.current, h = naturalH.current
    if (w > 0 && h > 0) {
      setFocalX(Math.max(0, Math.min(100, ((pxCrop.x + pxCrop.width  / 2) / w) * 100)))
      setFocalY(Math.max(0, Math.min(100, ((pxCrop.y + pxCrop.height / 2) / h) * 100)))
    }
  }, [])

  async function handleSave() {
    const pxCrop = pixelCropR.current
    if (!pxCrop) { setError('Adjust the crop first'); return }

    setSaving(true)
    setError(null)

    try {
      // Step 1: compute focal centre from refs (never stale)
      const w = naturalW.current, h = naturalH.current
      const fx = w > 0 ? Math.max(0, Math.min(100, ((pxCrop.x + pxCrop.width  / 2) / w) * 100)) : focalX
      const fy = h > 0 ? Math.max(0, Math.min(100, ((pxCrop.y + pxCrop.height / 2) / h) * 100)) : focalY

      // Step 2: generate thumbnail blob in browser
      setProgress('Generating thumbnail…')
      const blob = await generateThumbnailBlob(imageUrl, {
        x: Math.round(pxCrop.x), y: Math.round(pxCrop.y),
        width: Math.round(pxCrop.width), height: Math.round(pxCrop.height),
      })

      // Step 3: upload via existing upload route
      setProgress('Uploading…')
      const ext  = blob.type === 'image/webp' ? 'webp' : 'jpg'
      const file = new File([blob], `thumb-${Date.now()}.${ext}`, { type: blob.type })
      const form = new FormData()
      form.append('file', file)

      const res  = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok || !data.url) throw new Error(data.error ?? 'Upload failed')

      // Step 4: return saved crop with thumbnail URL
      onSave({
        crop_x:       parseFloat(fx.toFixed(3)),
        crop_y:       parseFloat(fy.toFixed(3)),
        crop_width:   0,
        crop_height:  0,
        crop_zoom:    parseFloat(zoom.toFixed(3)),
        thumbnail_url: data.url,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setSaving(false)
      setProgress('')
    }
  }

  // Preview = focal-point objectPosition (close approximation)
  const previewStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover',
    objectPosition: `${focalX}% ${focalY}%`,
    display: 'block',
  }

  return (
    <div
      className="crop-modal-overlay"
      role="dialog" aria-modal="true"
      onMouseDown={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="crop-modal">

        <div className="crop-modal-header">
          <div className="crop-modal-title"><CropIcon /> Crop Image</div>
          {sizeLabel && <div className="crop-modal-subtitle">{sizeLabel}</div>}
          <button type="button" className="crop-modal-close" onClick={onCancel} disabled={saving}>✕</button>
        </div>

        <div className="crop-modal-body">
          <div className="crop-canvas-wrap">
            <Cropper
              image={imageUrl}
              crop={cropPos}
              zoom={zoom}
              aspect={3 / 4}
              onCropChange={setCropPos}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="vertical-cover"
              showGrid
              style={{
                containerStyle: { background: '#0a0a0a', width: '100%', height: '100%' },
                cropAreaStyle: {
                  border: '2.5px solid rgba(200,255,87,0.9)',
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
                },
              }}
            />
          </div>

          <div className="crop-right-panel">
            <div className="crop-zoom-section">
              <div className="crop-zoom-label">
                <ZoomIcon /> Zoom
                <span className="crop-zoom-val">{zoom.toFixed(2)}×</span>
              </div>
              <input
                type="range" min="1" max="3" step="0.01"
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className="crop-zoom-slider"
                disabled={saving}
              />
              <div className="crop-zoom-hints"><span>1×</span><span>3×</span></div>
            </div>

            <div className="crop-preview-section">
              <div className="crop-preview-label">
                Live Preview <span>≈ user view</span>
              </div>
              <div className="crop-preview-wrap">
                <p className="crop-preview-sublabel">Gallery card (3:4)</p>
                <div className="crop-preview-card">
                  <img src={imageUrl} alt="Preview" style={previewStyle} draggable={false} />
                  <div className="crop-preview-card-bar">
                    <div className="crop-preview-card-title">Card Preview</div>
                  </div>
                </div>
              </div>
              <div className="crop-debug-vals">
                <span>x: {focalX.toFixed(1)}%</span>
                <span>y: {focalY.toFixed(1)}%</span>
              </div>
              {error && <div className="crop-error">{error}</div>}
            </div>

            <div className="crop-tips">
              <p>💡 <strong>Drag</strong> to reposition</p>
              <p>🔍 <strong>Scroll</strong> to zoom</p>
              <p>✨ Generates real thumbnail</p>
            </div>
          </div>
        </div>

        <div className="crop-modal-footer">
          {progress && <span className="crop-progress-label">{progress}</span>}
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={saving}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><SpinIcon /> {progress || 'Processing…'}</> : <><CheckIcon /> Apply Crop</>}
          </button>
        </div>
      </div>
    </div>
  )
}

function CropIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6.13 1L6 16a2 2 0 002 2h15"/><path d="M1 6.13L16 6a2 2 0 012 2v15"/></svg>
}
function ZoomIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>
}
function CheckIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
}
function SpinIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin-icon" aria-hidden="true"><path d="M21 12a9 9 0 00-9-9" /></svg>
}
