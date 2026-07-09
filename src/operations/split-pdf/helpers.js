import { PDFDocument } from 'pdf-lib'
import { baseName, parsePageRanges } from '../../lib/format.js'

async function subsetPdf(srcDoc, pageIndices) {
  const out = await PDFDocument.create()
  const pages = await out.copyPages(srcDoc, pageIndices)
  pages.forEach((p) => out.addPage(p))
  const bytes = await out.save()
  return new Blob([bytes], { type: 'application/pdf' })
}

/**
 * @param {File} file
 * @param {{mode:'explode'|'ranges', ranges:string}} opts
 * @returns {Promise<{filename:string, blob:Blob}[]>}
 */
export async function splitPdf(file, opts, onProgress) {
  const { mode = 'explode', ranges = '' } = opts || {}
  let src
  try {
    src = await PDFDocument.load(await file.arrayBuffer())
  } catch {
    throw new Error('Could not read this PDF. Encrypted PDFs are not supported.')
  }
  const total = src.getPageCount()
  const base = baseName(file.name)
  const results = []

  if (mode === 'explode') {
    for (let i = 0; i < total; i++) {
      onProgress?.(i / total, `Extracting page ${i + 1} of ${total}…`)
      const blob = await subsetPdf(src, [i])
      results.push({ filename: `${base}-p${String(i + 1).padStart(3, '0')}.pdf`, blob })
    }
  } else {
    // Each comma-separated group becomes its own output file.
    const groups = ranges.split(',').map((s) => s.trim()).filter(Boolean)
    if (!groups.length) throw new Error('Enter one or more page ranges, e.g. "1-3, 4-6".')
    for (let g = 0; g < groups.length; g++) {
      onProgress?.(g / groups.length, `Building file ${g + 1} of ${groups.length}…`)
      const pages = parsePageRanges(groups[g], total)
      if (!pages.length) throw new Error(`Range "${groups[g]}" has no valid pages (document has ${total}).`)
      const blob = await subsetPdf(src, pages.map((p) => p - 1))
      results.push({ filename: `${base}-${groups[g].replace(/[^0-9-]/g, '_')}.pdf`, blob })
    }
  }
  onProgress?.(1, 'Done')
  return results
}
