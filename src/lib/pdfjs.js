// Centralized pdf.js setup.
//
// The worker is imported via Vite's `?worker` suffix so it is BUNDLED LOCALLY
// and served from our own origin — never fetched from a CDN. This is required
// both for offline operation and for the strict CSP (worker-src 'self' blob:).
//
// We deliberately do NOT set cMapUrl / standardFontDataUrl to any remote URL.
// pdf.js only fetches those if configured to; leaving them unset means no
// network requests. (Rare CJK/embedded-font edge cases may render with fallback
// glyphs — an acceptable trade for the zero-network guarantee.)
import * as pdfjsLib from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'

pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker()

/** Load a PDF document from an ArrayBuffer/Uint8Array. */
export function loadPdf(data) {
  return pdfjsLib.getDocument({
    data,
    // Keep everything local & offline.
    disableAutoFetch: true,
    disableStream: true,
    isEvalSupported: false,
  }).promise
}

export { pdfjsLib }
