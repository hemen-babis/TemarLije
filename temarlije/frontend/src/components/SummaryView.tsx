import React from 'react'
import { useToast } from './Toast'

export default function SummaryView({ bullets }: { bullets: string[] }) {
  const { addToast } = useToast()

  const copy = async () => {
    const text = bullets.map(b => `- ${b}`).join('\n')
    await navigator.clipboard.writeText(text)
    addToast({ type: 'success', message: 'Summary copied to clipboard.' })
  }

  const downloadMd = () => {
    const text = bullets.map(b => `- ${b}`).join('\n')
    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Summary.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <ul className="list-disc pl-6 space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="leading-relaxed">{b}</li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2">
        <button className="btn" onClick={copy} aria-label="Copy summary to clipboard" title="Copy summary to clipboard">
          <svg className="w-5 h-5"><use href="#copy" /></svg> Copy
        </button>
        <button className="btn" onClick={downloadMd} aria-label="Download Summary.md" title="Download Summary.md">
          <svg className="w-5 h-5"><use href="#download" /></svg> Download .md
        </button>
      </div>
    </div>
  )
}

