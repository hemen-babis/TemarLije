import React, { useMemo, useState } from 'react'
import GuidedPaste from './components/GuidedPaste'
import StylePicker from './components/StylePicker'
import OutputTabs from './components/OutputTabs'
import EmptyState from './components/EmptyState'
import ToastHost, { Toast, ToastContextProvider, useToast } from './components/Toast'
import { GenerateResponse } from './lib/types'
import History, { HistoryItem } from './components/History'

type Style = 'visual' | 'reading' | 'kinesthetic' | 'audio'

export default function App() {
  const [style, setStyle] = useState<Style>('visual')
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const defaultOrder = useMemo(() => {
    if (style === 'visual') return ['summary', 'flashcards', 'elaboration'] as const
    if (style === 'reading') return ['elaboration', 'summary', 'flashcards'] as const
    return ['summary', 'flashcards', 'elaboration'] as const
  }, [style])

  const defaultActive = defaultOrder[0]

  return (
    <ToastContextProvider>
      <div className="min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="glass p-6">
            <GuidedPaste
              style={style}
              onResult={(r, t) => {
                setResult(r)
                setTitle(t || null)
                const item: HistoryItem = {
                  id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
                  style,
                  title: t || null,
                  data: r,
                  createdAt: Date.now(),
                }
                setHistory(prev => [item, ...prev].slice(0, 3))
              }}
            />
          </div>

          <div className="glass p-4">
            <StylePicker value={style} onChange={setStyle} />
          </div>

          <History
            items={history}
            onRestore={(it) => { setStyle(it.style); setResult(it.data); setTitle(it.title) }}
            onClear={() => setHistory([])}
          />

          {result ? (
            <OutputTabs
              title={title || undefined}
              data={result}
              defaultOrder={defaultOrder}
              defaultActive={defaultActive}
            />
          ) : (
            <EmptyState />
          )}
        </main>
        <ToastHost />
      </div>
    </ToastContextProvider>
  )
}

function Header() {
  const { addToast } = useToast()
  const [dark, setDark] = useState(true)
  React.useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark'); else root.classList.remove('dark')
  }, [dark])
  return (
    <header className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
      <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-brand-dark" aria-hidden="true"><use href="#logo-temarlije" /></svg>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">TemarLije</h1>
            <p className="text-sm text-slate-300">Paste any resource. Learn your way.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn"
            title="Toggle dark mode"
            aria-label="Toggle dark mode"
            onClick={() => setDark(d => !d)}
          >
            <svg className="w-5 h-5"><use href="#sparkles" /></svg>
            <span>{dark ? 'Dark' : 'Light'}</span>
          </button>
          <button
            className="btn"
            title="About TemarLije"
            aria-label="About TemarLije"
            onClick={() => addToast({ type: 'info', title: 'TemarLije', message: 'Paste a URL or text. Get flashcards, summaries, and explanations.' })}
          >
            <svg className="w-5 h-5"><use href="#info" /></svg>
            <span>About</span>
          </button>
        </div>
      </div>
    </header>
  )
}
