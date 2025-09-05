import React, { useMemo, useState } from 'react'
import { Flashcard } from '@/lib/types'
import { useToast } from './Toast'

export default function FlashcardView({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const { addToast } = useToast()

  const card = cards[index]
  const total = cards.length

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'temarlije_flashcards.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    addToast({ type: 'success', message: 'Flashcards exported as JSON.' })
  }

  const prev = () => { setFlipped(false); setIndex((i) => (i - 1 + total) % total) }
  const next = () => { setFlipped(false); setIndex((i) => (i + 1) % total) }

  return (
    <div className="space-y-4">
      <div className={`flip-container ${flipped ? 'flipped' : ''}`}>
        <div className="flipper">
          <div className="flip-face glass p-6 min-h-[180px]">
            <div className="text-sm uppercase tracking-wide text-slate-300 mb-2">Question</div>
            <div className="text-lg leading-relaxed">{card.q}</div>
          </div>
          <div className="flip-face flip-back glass p-6 min-h-[180px]">
            <div className="text-sm uppercase tracking-wide text-slate-300 mb-2">Answer</div>
            <div className="text-lg leading-relaxed">{card.a}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-300">{index + 1} / {total}</div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => setFlipped(f => !f)} aria-label="Flip card" title="Flip card">
            <svg className="w-5 h-5"><use href="#flashcards" /></svg>
            Flip
          </button>
          <button className="btn" onClick={prev} aria-label="Previous card" title="Previous card">
            <svg className="w-5 h-5 rotate-180"><use href="#link" /></svg>
            Prev
          </button>
          <button className="btn" onClick={next} aria-label="Next card" title="Next card">
            <svg className="w-5 h-5"><use href="#link" /></svg>
            Next
          </button>
          <button className="btn" onClick={exportJson} aria-label="Export flashcards as JSON" title="Export flashcards as JSON">
            <svg className="w-5 h-5"><use href="#download" /></svg>
            Export JSON
          </button>
        </div>
      </div>
    </div>
  )
}

