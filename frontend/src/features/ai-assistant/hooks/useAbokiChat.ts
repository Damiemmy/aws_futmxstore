import { useCallback, useState } from 'react'
import { sendChatMessage } from '../services'
import type { ChatMessageData } from '../types'

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const welcomeMessage: ChatMessageData = {
  id: 'aboki-welcome',
  role: 'assistant',
  content:
    "Sannu! 👋 I'm Aboki, your FUTMxStore study companion. Ask me a question about your courses, and I'll help you understand concepts and find relevant study materials.",
}

export function useAbokiChat() {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    welcomeMessage,
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (rawMessage: string) => {
      const query = rawMessage.trim()

      if (!query || isLoading) return

      const userMessage: ChatMessageData = {
        id: createId(),
        role: 'user',
        content: query,
      }

      setMessages((current) => [...current, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        const response = await sendChatMessage({
          query,
          top_k: 5,
        })

        const assistantMessage: ChatMessageData = {
          id: createId(),
          role: 'assistant',
          content: response.answer,
          sources: response.sources ?? [],
          status: response.status,
        }

        setMessages((current) => [...current, assistantMessage])
      } catch {
        const message =
          'I could not reach the study assistant just now. Please check your connection and try again.'

        setError(message)

        setMessages((current) => [
          ...current,
          {
            id: createId(),
            role: 'assistant',
            content: message,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading],
  )

  const clearConversation = useCallback(() => {
    if (isLoading) return

    setMessages([welcomeMessage])
    setError(null)
  }, [isLoading])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation,
  }
}