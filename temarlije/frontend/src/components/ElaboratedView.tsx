import React from 'react'
import { renderMarkdown } from '@/lib/markdown'
import { useToast } from './Toast'

export default function ElaboratedView({ markdown }: { markdown: string }) {
  const { addToast } = useToast()
  const copy = async () => {
    await navigator.clipboard.writeText(markdown)
    addToast({ type: 'success', message: 'Elaboration copied to clipboard.' })
  }
  const downloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Elaboration.md'
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div>
      {renderMarkdown(markdown)}
      <div className="mt-4 flex items-center gap-2">
        <button className="btn" onClick={copy} aria-label="Copy elaboration to clipboard" title="Copy elaboration to clipboard">
          <svg className="w-5 h-5"><use href="#copy" /></svg> Copy
        </button>
        <button className="btn" onClick={downloadMd} aria-label="Download Elaboration.md" title="Download Elaboration.md">
          <svg className="w-5 h-5"><use href="#download" /></svg> Download .md
        </button>
      </div>
    </div>
  )
}

