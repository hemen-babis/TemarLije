import React from 'react'
import heroUrl from '@/assets/hero-illustration.svg'

export default function EmptyState() {
  return (
    <div className="glass p-10 flex flex-col md:flex-row items-center gap-8">
      <img src={heroUrl} alt="Abstract study illustration" className="w-full md:w-1/2 rounded-xl" />
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">Start with a paste</h2>
        <p className="text-slate-300">Drop in an article, notes, or a link. We’ll turn it into flashcards, summaries, and explanations.</p>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <svg className="w-4 h-4"><use href="#sparkles" /></svg>
          <span>No sign-up required in dev. Keep your API keys safe.</span>
        </div>
      </div>
    </div>
  )
}

