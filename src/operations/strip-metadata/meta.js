export default {
  id: 'strip-metadata',
  name: 'Strip Image Metadata',
  description: 'Remove EXIF, GPS, and other metadata by re-encoding the image.',
  category: 'image',
  icon: 'lock',
  order: 23,
  notes:
    'Re-drawing the image through a canvas produces a clean file with no EXIF/GPS/camera metadata. Pixels are preserved; the format stays the same unless you change it.',
}
