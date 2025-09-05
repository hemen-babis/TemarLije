import React, { useEffect, useMemo, useState } from 'react'
import { GenerateResponse } from '@/lib/types'
import FlashcardView from './FlashcardView'
import SummaryView from './SummaryView'
import ElaboratedView from './ElaboratedView'

type TabKey = 'flashcards' | 'summary' | 'elaboration'

export default function OutputTabs({
  title,
  data,
  defaultOrder,
  defaultActive,
}: {
  title?: string
  data: GenerateResponse
  defaultOrder: readonly ['summary', 'flashcards', 'elaboration'] | readonly ['elaboration', 'summary', 'flashcards']
  defaultActive: 'summary' | 'flashcards' | 'elaboration'
}) {
  const [active, setActive] = useState<TabKey>(defaultActive)
  useEffect(() => setActive(defaultActive), [defaultActive])

  const order: TabKey[] = useMemo(() => [defaultOrder[0], defaultOrder[1], defaultOrder[2]] as TabKey[], [defaultOrder])

  const tabs: { key: TabKey; icon: string; label: string }[] = [
    { key: 'flashcards', icon: '#tab-flashcards', label: 'Flashcards' },
    { key: 'summary', icon: '#tab-summary', label: 'Summary' },
    { key: 'elaboration', icon: '#tab-elaborated', label: 'Elaborated' },
  ]

  const sortedTabs = order.map(k => tabs.find(t => t.key === k)!)

  return (
    <div className="glass">
      <div className="border-b border-white/10 px-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {sortedTabs.map(t => (
            <button
              key={t.key}
              className={`px-4 py-3 inline-flex items-center gap-2 border-b-2 ${active === t.key ? 'border-brand-dark text-white' : 'border-transparent text-slate-300 hover:text-white'}`}
              onClick={() => setActive(t.key)}
              aria-label={`Show ${t.label}`}
              title={`Show ${t.label}`}
            >
              <svg className="w-5 h-5"><use href={t.icon} /></svg>
              <span className="whitespace-nowrap">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {title && (
          <div className="mb-4 flex items-center gap-2 text-slate-300"><svg className="w-4 h-4"><use href="#link" /></svg><span className="text-sm truncate" title={title}>{title}</span></div>
        )}
        {active === 'flashcards' && <FlashcardView cards={data.flashcards} />}
        {active === 'summary' && <SummaryView bullets={data.summary} />}
        {active === 'elaboration' && <ElaboratedView markdown={data.elaboration} />}
      </div>
    </div>
  )}

