export default {
  id: 'word-to-pdf',
  name: 'Word → PDF',
  description: 'Convert a .docx document to PDF.',
  category: 'pdf',
  icon: 'fileIn',
  order: 12,
  notes:
    'This reads your .docx text and structure (headings, lists, bold/italic) and re-flows it into a clean PDF. Layout is APPROXIMATE — exact fonts, spacing, images, columns, and tables are not reproduced. For text-heavy documents it works well.',
}
