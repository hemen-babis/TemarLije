import React from 'react'

// Minimal markdown renderer: headings (#, ##, ###), lists (-, *), bold (**), italics (* or _)
export function renderMarkdown(md: string): React.ReactNode {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const out: React.ReactNode[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (/^\s*$/.test(line)) { i++; continue }
    // headings
    const h = /^(#{1,3})\s+(.*)$/.exec(line)
    if (h) {
      const level = h[1].length
      const content = inline(h[2])
      out.push(React.createElement(level === 1 ? 'h2' : level === 2 ? 'h2' : 'h3', { key: i }, content))
      i++
      continue
    }
    // list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: React.ReactNode[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        const item = lines[i].replace(/^\s*[-*]\s+/, '')
        items.push(<li key={i}>{inline(item)}</li>)
        i++
      }
      out.push(<ul key={`ul-${i}`}>{items}</ul>)
      continue
    }
    // paragraph (collect until blank)
    const buf: string[] = [line]
    i++
    while (i < lines.length && !/^\s*$/.test(lines[i])) {
      buf.push(lines[i])
      i++
    }
    out.push(<p key={`p-${i}`}>{inline(buf.join(' '))}</p>)
  }
  return <div className="md">{out}</div>
}

function inline(s: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let i = 0
  while (i < s.length) {
    // bold **text**
    const bold = s.indexOf('**', i)
    const italicStar = s.indexOf('*', i)
    const italicUnd = s.indexOf('_', i)
    const nextMarker = [bold >= 0 ? bold : Infinity, italicStar >= 0 ? italicStar : Infinity, italicUnd >= 0 ? italicUnd : Infinity].reduce((a, b) => Math.min(a, b), Infinity)
    if (nextMarker === Infinity) {
      parts.push(s.slice(i))
      break
    }
    if (nextMarker > i) parts.push(s.slice(i, nextMarker))
    if (nextMarker === bold) {
      const end = s.indexOf('**', bold + 2)
      if (end > bold) {
        parts.push(<strong key={`b-${i}`}>{s.slice(bold + 2, end)}</strong>)
        i = end + 2
        continue
      }
    }
    if (nextMarker === italicStar) {
      const end = s.indexOf('*', italicStar + 1)
      if (end > italicStar) {
        parts.push(<em key={`i-${i}`}>{s.slice(italicStar + 1, end)}</em>)
        i = end + 1
        continue
      }
    }
    if (nextMarker === italicUnd) {
      const end = s.indexOf('_', italicUnd + 1)
      if (end > italicUnd) {
        parts.push(<em key={`u-${i}`}>{s.slice(italicUnd + 1, end)}</em>)
        i = end + 1
        continue
      }
    }
    // If no valid closing, append the marker and move on
    parts.push(s[nextMarker])
    i = nextMarker + 1
  }
  return <>{parts}</>
}

