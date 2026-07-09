import { useRef } from 'react'

// Interactive crop selection overlaid on the image. Selection is stored in the
// image's natural pixel coordinates; rendering uses percentages so it stays
// correct at any display size. Move by dragging the box; resize via corners.
const MIN = 16
const CORNERS = [
  ['nw', 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize'],
  ['ne', 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize'],
  ['sw', 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize'],
  ['se', 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize'],
]

export default function Cropper({ url, natural, sel, onChange }) {
  const imgRef = useRef(null)
  const drag = useRef(null)

  const clamp = (s) => {
    const W = natural.width
    const H = natural.height
    let { x, y, w, h } = s
    w = Math.min(Math.max(MIN, w), W)
    h = Math.min(Math.max(MIN, h), H)
    x = Math.min(Math.max(0, x), W - w)
    y = Math.min(Math.max(0, y), H - h)
    return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) }
  }

  const start = (mode) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = imgRef.current.getBoundingClientRect()
    const scale = natural.width / rect.width
    drag.current = { mode, sx: e.clientX, sy: e.clientY, base: { ...sel }, scale }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }
  const onMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = (e.clientX - d.sx) * d.scale
    const dy = (e.clientY - d.sy) * d.scale
    const b = d.base
    let s = { ...b }
    switch (d.mode) {
      case 'move':
        s.x = b.x + dx
        s.y = b.y + dy
        break
      case 'nw':
        s.x = b.x + dx
        s.y = b.y + dy
        s.w = b.w - dx
        s.h = b.h - dy
        break
      case 'ne':
        s.y = b.y + dy
        s.w = b.w + dx
        s.h = b.h - dy
        break
      case 'sw':
        s.x = b.x + dx
        s.w = b.w - dx
        s.h = b.h + dy
        break
      case 'se':
        s.w = b.w + dx
        s.h = b.h + dy
        break
      default:
        break
    }
    // prevent inverted rectangles
    if (s.w < MIN) {
      if (d.mode === 'nw' || d.mode === 'sw') s.x = b.x + b.w - MIN
      s.w = MIN
    }
    if (s.h < MIN) {
      if (d.mode === 'nw' || d.mode === 'ne') s.y = b.y + b.h - MIN
      s.h = MIN
    }
    onChange(clamp(s))
  }
  const onUp = () => {
    drag.current = null
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }

  const pct = (v, total) => `${(v / total) * 100}%`

  return (
    <div className="relative inline-block max-w-full select-none">
      <img ref={imgRef} src={url} alt="Crop source" className="block max-h-[28rem] max-w-full" draggable={false} />
      {/* dim outside the selection */}
      <div className="pointer-events-none absolute inset-0 bg-black/40" style={{
        clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${pct(sel.y, natural.height)}, ${pct(sel.x, natural.width)} ${pct(sel.y, natural.height)}, ${pct(sel.x, natural.width)} ${pct(sel.y + sel.h, natural.height)}, ${pct(sel.x + sel.w, natural.width)} ${pct(sel.y + sel.h, natural.height)}, ${pct(sel.x + sel.w, natural.width)} ${pct(sel.y, natural.height)}, 0 ${pct(sel.y, natural.height)})`,
      }} />
      <div
        onPointerDown={start('move')}
        className="absolute cursor-move border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
        style={{
          left: pct(sel.x, natural.width),
          top: pct(sel.y, natural.height),
          width: pct(sel.w, natural.width),
          height: pct(sel.h, natural.height),
        }}
      >
        {CORNERS.map(([mode, cls]) => (
          <span
            key={mode}
            onPointerDown={start(mode)}
            className={`absolute h-3 w-3 rounded-full border border-slate-500 bg-white ${cls}`}
          />
        ))}
      </div>
    </div>
  )
}
