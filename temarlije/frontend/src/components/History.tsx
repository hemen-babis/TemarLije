import React from 'react'
import { GenerateResponse } from '@/lib/types'

export type HistoryItem = {
  id: string
  style: 'visual' | 'reading' | 'kinesthetic' | 'audio'
  title: string | null
  data: GenerateResponse
  createdAt: number
}

export default function History({ items, onRestore, onClear }: {
  items: HistoryItem[]
  onRestore: (item: HistoryItem) => void
  onClear: () => void
}) {
  if (!items.length) return null
  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5"><use href="#info" /></svg>
          <h3 className="font-medium">Recent sessions</h3>
        </div>
        <button className="btn" onClick={onClear} aria-label="Clear history" title="Clear history">
          <svg className="w-4 h-4"><use href="#close" /></svg> Clear
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id}>
            <button
              className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
              onClick={() => onRestore(it)}
              aria-label={`Restore session ${new Date(it.createdAt).toLocaleString()}`}
              title={`Restore session from ${new Date(it.createdAt).toLocaleString()}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-300">
                    <use href={it.style === 'visual' ? '#magnifier' : it.style === 'reading' ? '#book' : it.style === 'kinesthetic' ? '#puzzle' : '#audio'} />
                  </svg>
                  <span className="text-sm">{it.title || (it.data.summary[0] ? truncate(it.data.summary[0], 60) : 'Untitled')}</span>
                </div>
                <span className="text-xs text-slate-400">{new Date(it.createdAt).toLocaleTimeString()}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function truncate(s: string, n: number) { return s.length > n ? s.slice(0, n - 1) + '…' : s }

