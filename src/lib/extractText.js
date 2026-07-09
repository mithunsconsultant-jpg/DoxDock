import { loadPdf } from './pdfjs.js'

// Extract text from a PDF using pdf.js. Reconstructs line breaks from glyph
// positions (pdf.js gives positioned text runs, not paragraphs) so the output
// is readable. Works for text-based PDFs; scanned/image PDFs contain no text
// layer and will come back empty (we surface that to the user).
export async function extractPdfText(file, onProgress) {
  const data = new Uint8Array(await file.arrayBuffer())
  const pdf = await loadPdf(data)
  const pages = []
  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.((i - 1) / pdf.numPages, `Reading page ${i} of ${pdf.numPages}…`)
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    let text = ''
    let lastY = null
    for (const item of content.items) {
      if (!('str' in item)) continue
      const y = item.transform[5]
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        // New line. A large gap implies a paragraph break.
        text += Math.abs(y - lastY) > item.height * 1.6 ? '\n\n' : '\n'
      } else if (text && !text.endsWith(' ') && !text.endsWith('\n')) {
        text += item.str.startsWith(' ') ? '' : ' '
      }
      text += item.str
      lastY = y
    }
    pages.push(text.replace(/[ \t]+\n/g, '\n').trim())
    page.cleanup?.()
  }
  onProgress?.(1, 'Done')
  return pages
}
