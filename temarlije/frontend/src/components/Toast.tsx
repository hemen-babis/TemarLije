import React, { createContext, useContext, useMemo, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
  id?: string
  type: ToastType
  title?: string
  message: string
  timeoutMs?: number
}

type ToastCtx = {
  addToast: (t: Toast) => void
  removeToast: (id: string) => void
}

const Ctx = createContext<ToastCtx | null>(null)

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Required<Toast>[]>([])

  const addToast = (t: Toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const full: Required<Toast> = {
      id,
      type: t.type,
      title: t.title ?? (t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Info'),
      message: t.message,
      timeoutMs: t.timeoutMs ?? 3500,
    }
    setToasts(prev => [...prev, full])
    window.setTimeout(() => removeToast(id), full.timeoutMs)
  }

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  const value = useMemo(() => ({ addToast, removeToast }), [])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2" aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} className="glass px-4 py-3 min-w-[260px] max-w-sm flex items-start gap-3">
            <div className="mt-0.5">
              <svg className={`w-5 h-5 ${t.type === 'success' ? 'text-emerald-400' : t.type === 'error' ? 'text-rose-400' : 'text-brand-dark'}`} aria-hidden="true">
                <use href={t.type === 'success' ? '#check' : t.type === 'error' ? '#warning' : '#info'} />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-slate-300">{t.message}</div>
            </div>
            <button
              className="btn px-2 py-1"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
              title="Dismiss"
            >
              <svg className="w-4 h-4"><use href="#close" /></svg>
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export default function ToastHost() {
  return null
}

export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast must be used within ToastContextProvider')
  return ctx
}

