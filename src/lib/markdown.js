// Minimal, dependency-free Markdown -> block model parser (see pdfLayout.js for
// the block/run shapes). Covers the common subset: headings, bold/italic/inline
// code, links (rendered as "text (url)"), unordered/ordered lists, blockquotes,
// fenced code blocks, and horizontal rules. Not a full CommonMark implementation.

/** Parse inline markdown into styled runs. */
export function parseInline(text) {
  const runs = []
  let i = 0
  const src = String(text)
  let buf = ''
  let bold = false
  let italic = false
  const flush = () => {
    if (buf) runs.push({ text: buf, bold, italic })
    buf = ''
  }
  while (i < src.length) {
    const two = src.slice(i, i + 2)
    if (two === '**' || two === '__') {
      flush()
      bold = !bold
      i += 2
      continue
    }
    const ch = src[i]
    if ((ch === '*' || ch === '_') && src[i + 1] !== ' ') {
      flush()
      italic = !italic
      i += 1
      continue
    }
    if (ch === '`') {
      const end = src.indexOf('`', i + 1)
      if (end !== -1) {
        flush()
        runs.push({ text: src.slice(i + 1, end), code: true })
        i = end + 1
        continue
      }
    }
    if (ch === '[') {
      const close = src.indexOf(']', i)
      if (close !== -1 && src[close + 1] === '(') {
        const paren = src.indexOf(')', close)
        if (paren !== -1) {
          flush()
          const label = src.slice(i + 1, close)
          const url = src.slice(close + 2, paren)
          runs.push({ text: label === url ? label : `${label} (${url})`, bold, italic })
          i = paren + 1
          continue
        }
      }
    }
    buf += ch
    i += 1
  }
  flush()
  return runs.length ? runs : [{ text: '' }]
}

export function markdownToBlocks(md) {
  const lines = String(md).replace(/\r\n?/g, '\n').split('\n')
  const blocks = []
  let i = 0
  let para = []
  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'paragraph', runs: parseInline(para.join(' ')) })
      para = []
    }
  }

  while (i < lines.length) {
    const line = lines[i]

    // fenced code
    const fence = line.match(/^\s*(```|~~~)/)
    if (fence) {
      flushPara()
      const marker = fence[1]
      const code = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith(marker)) {
        code.push(lines[i])
        i++
      }
      i++ // skip closing fence
      blocks.push({ type: 'code', text: code.join('\n') })
      continue
    }

    if (/^\s*$/.test(line)) {
      flushPara()
      i++
      continue
    }
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      flushPara()
      blocks.push({ type: 'hr' })
      i++
      continue
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      flushPara()
      blocks.push({ type: 'heading', level: h[1].length, runs: parseInline(h[2].trim()) })
      i++
      continue
    }
    const bq = line.match(/^\s*>\s?(.*)$/)
    if (bq) {
      flushPara()
      const quote = [bq[1]]
      i++
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ''))
        i++
      }
      blocks.push({ type: 'blockquote', runs: parseInline(quote.join(' ')) })
      continue
    }
    const ul = line.match(/^(\s*)[-*+]\s+(.*)$/)
    const ol = line.match(/^(\s*)(\d+)[.)]\s+(.*)$/)
    if (ul || ol) {
      flushPara()
      let n = 1
      while (i < lines.length) {
        const u = lines[i].match(/^(\s*)[-*+]\s+(.*)$/)
        const o = lines[i].match(/^(\s*)(\d+)[.)]\s+(.*)$/)
        if (!u && !o) break
        const depth = Math.floor(((u || o)[1].length || 0) / 2)
        if (o) {
          blocks.push({ type: 'listitem', ordered: true, index: parseInt(o[2], 10), depth, runs: parseInline(o[3]) })
        } else {
          blocks.push({ type: 'listitem', ordered: false, index: n++, depth, runs: parseInline(u[2]) })
        }
        i++
      }
      continue
    }

    para.push(line.trim())
    i++
  }
  flushPara()
  return blocks
}
