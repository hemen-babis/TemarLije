import React, { useEffect, useMemo, useState } from 'react'
import { generate, ingest } from '@/lib/api'
import { GenerateResponse, IngestResponse } from '@/lib/types'
import Loading from './Loading'
import { useToast } from './Toast'

const URL_RE = /^https?:\/\//i

export default function GuidedPaste({
  style,
  onResult,
}: {
  style: 'visual' | 'reading' | 'kinesthetic' | 'audio'
  onResult: (result: GenerateResponse, title?: string | null) => void
}) {
  const [input, setInput] = useState('')
  const [detected, setDetected] = useState<'url' | 'text'>('text')
  const [loading, setLoading] = useState(false)
  const [chars, setChars] = useState(0)
  const { addToast } = useToast()

  useEffect(() => {
    const trimmed = input.trim()
    setDetected(URL_RE.test(trimmed) ? 'url' : 'text')
    setChars(trimmed.length)
  }, [input])

  const tooShort = useMemo(() => detected === 'text' && chars > 0 && chars < 100, [detected, chars])

  const handleSubmit = async () => {
    if (tooShort) return
    setLoading(true)
    try {
      const ing: IngestResponse = await ingest(input)
      const gen = await generate(ing.content, style)
      onResult(gen, ing.title)
      addToast({ type: 'success', message: 'Study pack ready.' })
    } catch (e: any) {
      const msg = String(e?.message || e || 'Something went wrong')
      if (detected === 'url') {
        addToast({ type: 'error', message: "Couldn’t read that page. Try another link or paste the text." })
      } else {
        addToast({ type: 'error', message: msg })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <label htmlFor="paste-area" className="block text-sm font-medium text-slate-300">Paste text or a URL</label>
      <div className="relative">
        <div className="absolute left-3 top-3 text-slate-400">
          <svg className="w-5 h-5"><use href="#paste" /></svg>
        </div>
        <textarea
          id="paste-area"
          className="w-full min-h-[140px] pl-10 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand/60"
          placeholder="Paste text or a URL (http/https)"
          aria-label="Paste text or a URL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="absolute right-3 bottom-3 text-xs text-slate-400">{chars} chars</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-white/10 border border-white/10">
            <svg className="w-3.5 h-3.5 text-brand-dark">
              <use href={detected === 'url' ? '#url' : '#text'} />
            </svg>
            Detected: {detected === 'url' ? 'URL' : 'Text'}
          </span>
          {tooShort && (
            <span className="text-xs text-amber-300">Please paste at least 100 characters or use a URL.</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`btn btn-primary ${tooShort || loading ? 'btn-disabled' : ''}`}
            onClick={handleSubmit}
            disabled={tooShort || loading}
            title="Generate Study Pack"
            aria-label="Generate Study Pack"
          >
            {loading ? (
              <Loading label="Generating" />
            ) : (
              <>
                <svg className="w-5 h-5"><use href="#sparkles" /></svg>
                <span>Generate Study Pack</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

