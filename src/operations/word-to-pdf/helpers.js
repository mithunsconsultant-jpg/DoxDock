import mammoth from 'mammoth/mammoth.browser.js'
import { htmlToBlocks } from '../../lib/htmlBlocks.js'
import { renderBlocksToPdf } from '../../lib/pdfLayout.js'

/**
 * @param {File} file  a .docx file
 * @param {{pageSize:string, fontSize:number}} opts
 */
export async function wordToPdf(file, opts, onProgress) {
  if (!/\.docx$/i.test(file.name)) {
    throw new Error('Please choose a .docx file. Legacy .doc files are not supported.')
  }
  onProgress?.(0.2, 'Reading document…')
  let html
  try {
    const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() })
    html = result.value
  } catch {
    throw new Error('Could not read this .docx. It may be corrupt or password-protected.')
  }
  onProgress?.(0.55, 'Laying out pages…')
  const blocks = htmlToBlocks(html)
  const blob = await renderBlocksToPdf(blocks, {
    pageSize: opts?.pageSize || 'A4',
    fontSize: Number(opts?.fontSize) || 11,
  })
  onProgress?.(1, 'Done')
  return blob
}
