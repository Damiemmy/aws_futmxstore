export type AbokiStatus = 'answered' | 'conversation'

export interface ChatRequest {
  query: string
  top_k?: number
}

export interface AbokiSource {
  source_id: string
  material_id: number
  title: string
  course_code: string
  page_number: number
  material_url: string | null
}

export interface ChatResponse {
  status: AbokiStatus
  answer: string
  sources: AbokiSource[]
}

export interface RetrievedChunk {
  chunk_id: number
  material_id: number
  material_title: string
  course_code: string
  page_number: number
  chunk_index: number
  text: string
  material_url: string | null
  rrf_score: number
  keyword_score: number
  semantic_score: number
}

export interface HybridSearchResponse {
  query: string
  count: number
  results: RetrievedChunk[]
}

export interface MaterialSummaryResponse {
  status: 'summarized'
  material_id: number
  title: string
  pages_processed: number
  summary: string
}

export interface MaterialSummaryUnavailable {
  status: 'unavailable' | 'not_indexed'
  message: string
}

export type MaterialSummaryResult =
  | MaterialSummaryResponse
  | MaterialSummaryUnavailable

export type ChatMessageRole = 'assistant' | 'user'

export interface ChatMessageData {
  id: string
  role: ChatMessageRole
  content: string
  sources?: AbokiSource[]
  status?: AbokiStatus
}