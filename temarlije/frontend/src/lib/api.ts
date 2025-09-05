import { GenerateRequest, GenerateResponse, IngestRequest, IngestResponse } from './types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function jsonFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })
  const ct = res.headers.get('content-type') || ''
  const isJson = ct.includes('application/json')
  const body = isJson ? await res.json() : await res.text()
  if (!res.ok) {
    const detail = isJson ? (body?.detail || JSON.stringify(body)) : body
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail))
  }
  return body as T
}

export async function ingest(input: string): Promise<IngestResponse> {
  const payload: IngestRequest = { input }
  return jsonFetch('/api/ingest', { method: 'POST', body: JSON.stringify(payload) })
}

export async function generate(content: string, style: GenerateRequest['style']): Promise<GenerateResponse> {
  const payload: GenerateRequest = { content, style }
  return jsonFetch('/api/generate', { method: 'POST', body: JSON.stringify(payload) })
}

