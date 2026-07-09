import { decode, drawToCanvas, canvasToBlob } from '../../lib/imageCanvas.js'
import { formatFromType, outName } from '../../lib/imageFormat.js'

// Re-encoding via canvas discards all metadata (EXIF, GPS, thumbnails, etc.).
export async function stripMetadata(file, opts, onProgress) {
  const { quality = 0.95 } = opts || {}
  onProgress?.(0.3, 'Decoding image…')
  const bitmap = await decode(file)
  const fmt = formatFromType(file.type)
  onProgress?.(0.6, 'Re-encoding without metadata…')
  const canvas = drawToCanvas(bitmap, { background: fmt === 'jpeg' ? '#ffffff' : undefined })
  const blob = await canvasToBlob(canvas, fmt, quality)
  bitmap.close?.()
  onProgress?.(1, 'Done')
  return { blob, filename: outName(file.name, fmt, '-clean'), before: file.size, after: blob.size }
}
