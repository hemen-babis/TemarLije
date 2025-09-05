export type IngestRequest = { input: string }
export type IngestResponse = {
  kind: 'url' | 'text'
  title: string | null
  content: string
}

export type Flashcard = { q: string; a: string }

export type GenerateRequest = {
  content: string
  style: 'visual' | 'reading' | 'kinesthetic' | 'audio'
}

export type GenerateResponse = {
  flashcards: Flashcard[]
  summary: string[]
  elaboration: string
}

