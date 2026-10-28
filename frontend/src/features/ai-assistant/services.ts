import { api } from '../../api/client'
import type {
  ChatRequest,
  ChatResponse,
  HybridSearchResponse,
  MaterialSummaryResult,
} from './types'

export async function sendChatMessage(
  payload: ChatRequest,
): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>(
    '/ai-assistant/chat/',
    payload,
  )

  return data
}

export async function searchAcademicMaterials(
  payload: ChatRequest,
): Promise<HybridSearchResponse> {
  const { data } = await api.post<HybridSearchResponse>(
    '/ai-assistant/search/',
    payload,
  )

  return data
}

export async function summarizeMaterial(
  materialId: number,
): Promise<MaterialSummaryResult> {
  const { data } = await api.post<MaterialSummaryResult>(
    `/ai-assistant/materials/${materialId}/summarize/`,
  )

  return data
}