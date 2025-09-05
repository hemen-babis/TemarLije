import React from 'react'

export default function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3" role="status" aria-live="polite">
      <svg className="w-5 h-5 animate-spin text-brand-dark"><use href="#spinner" /></svg>
      <span className="text-sm text-slate-300">{label}…</span>
    </div>
  )
}

