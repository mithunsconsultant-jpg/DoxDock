export default {
  id: 'compress-pdf',
  name: 'Compress PDF',
  description: 'Shrink a PDF by re-encoding page images and stripping metadata.',
  category: 'pdf',
  icon: 'compress',
  order: 7,
  notes:
    'Results vary a lot by document. The "re-encode pages" mode rasterizes each page to a compressed image — great for scans and image-heavy PDFs, but the text becomes non-selectable. Text-only PDFs are already small and barely compress; use "strip metadata" (lossless) for those.',
}
