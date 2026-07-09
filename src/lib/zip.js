import { zipSync } from 'fflate'

// Bundle multiple results into a single .zip, entirely in-memory / in-browser.
// `files` = [{ filename, blob }]. Returns a Blob.
export async function zipFiles(files) {
  const entries = {}
  for (const { filename, blob } of files) {
    const buf = new Uint8Array(await blob.arrayBuffer())
    // Store already-compressed formats (jpg/png/pdf) without re-deflating.
    const lower = filename.toLowerCase()
    const precompressed = /\.(jpg|jpeg|png|webp|gif|pdf|zip)$/.test(lower)
    entries[filename] = [buf, { level: precompressed ? 0 : 6 }]
  }
  const zipped = zipSync(entries)
  return new Blob([zipped], { type: 'application/zip' })
}
