// Parse an HTML string into the pdfLayout block model using the browser's own
// DOMParser (no external library). Walks the DOM and maps common elements to
// blocks/runs. Styling/CSS/tables/images are not reproduced — approximate layout.

function inlineRuns(node, style = {}) {
  const runs = []
  const walk = (n, st) => {
    if (n.nodeType === Node.TEXT_NODE) {
      const text = n.textContent.replace(/\s+/g, ' ')
      if (text) runs.push({ text, ...st })
      return
    }
    if (n.nodeType !== Node.ELEMENT_NODE) return
    const tag = n.tagName.toLowerCase()
    const next = { ...st }
    if (tag === 'strong' || tag === 'b') next.bold = true
    if (tag === 'em' || tag === 'i') next.italic = true
    if (tag === 'code') next.code = true
    if (tag === 'br') {
      runs.push({ text: '\n', ...st })
      return
    }
    if (tag === 'a') {
      const href = n.getAttribute('href')
      const label = n.textContent.replace(/\s+/g, ' ').trim()
      if (href && href !== label && !href.startsWith('#')) {
        runs.push({ text: `${label} (${href})`, ...next })
        return
      }
    }
    for (const child of n.childNodes) walk(child, next)
  }
  walk(node, style)
  return runs.length ? runs : [{ text: '' }]
}

export function htmlToBlocks(html) {
  const doc = new DOMParser().parseFromString(String(html), 'text/html')
  const blocks = []

  const handleList = (listEl, ordered, depth) => {
    let index = 1
    for (const li of listEl.children) {
      if (li.tagName?.toLowerCase() !== 'li') continue
      // Text of this li excluding nested lists
      const clone = li.cloneNode(true)
      const nested = []
      clone.querySelectorAll('ul, ol').forEach((sub) => {
        nested.push(sub)
        sub.remove()
      })
      blocks.push({
        type: 'listitem',
        ordered,
        index: index++,
        depth,
        runs: inlineRuns(clone),
      })
      for (const subList of li.querySelectorAll(':scope > ul, :scope > ol')) {
        handleList(subList, subList.tagName.toLowerCase() === 'ol', depth + 1)
      }
    }
  }

  const walk = (node) => {
    for (const el of node.children) {
      const tag = el.tagName.toLowerCase()
      if (/^h[1-6]$/.test(tag)) {
        blocks.push({ type: 'heading', level: parseInt(tag[1], 10), runs: inlineRuns(el) })
      } else if (tag === 'p') {
        blocks.push({ type: 'paragraph', runs: inlineRuns(el) })
      } else if (tag === 'ul' || tag === 'ol') {
        handleList(el, tag === 'ol', 0)
      } else if (tag === 'blockquote') {
        blocks.push({ type: 'blockquote', runs: inlineRuns(el) })
      } else if (tag === 'pre') {
        blocks.push({ type: 'code', text: el.textContent.replace(/\n$/, '') })
      } else if (tag === 'hr') {
        blocks.push({ type: 'hr' })
      } else if (['div', 'section', 'article', 'main', 'header', 'footer', 'body'].includes(tag)) {
        walk(el) // recurse into containers
      } else if (tag === 'table') {
        // Flatten table rows into pipe-joined paragraphs (approximate).
        for (const row of el.querySelectorAll('tr')) {
          const cells = [...row.children].map((c) => c.textContent.replace(/\s+/g, ' ').trim())
          blocks.push({ type: 'paragraph', runs: [{ text: cells.join('  |  ') }] })
        }
      } else {
        const text = el.textContent.replace(/\s+/g, ' ').trim()
        if (text) blocks.push({ type: 'paragraph', runs: inlineRuns(el) })
      }
    }
  }

  walk(doc.body)
  return blocks.length ? blocks : [{ type: 'paragraph', runs: [{ text: '' }] }]
}
