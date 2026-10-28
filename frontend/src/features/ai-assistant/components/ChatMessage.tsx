import { BookOpen, ExternalLink } from 'lucide-react'
import { AbokiAvatar } from './AbokiAvatar'
import type { ChatMessageData } from '../types'

interface ChatMessageProps {
  message: ChatMessageData
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant'

  return (
    <div
      className={`flex items-start gap-3 ${
        isAssistant ? '' : 'flex-row-reverse'
      }`}
    >
      {isAssistant ? (
        <AbokiAvatar size="sm" />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-white">
          You
        </div>
      )}

      <div
        className={`min-w-0 max-w-[88%] sm:max-w-[78%] ${
          isAssistant ? '' : 'text-right'
        }`}
      >
        <p className="mb-1 px-1 text-xs font-medium text-ink/50">
          {isAssistant ? 'Aboki' : 'You'}
        </p>

        <div
          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 ${
            isAssistant
              ? 'rounded-tl-md border border-ink/5 bg-white text-ink shadow-sm'
              : 'rounded-tr-md bg-ink text-white'
          }`}
        >
          {message.content}
        </div>

        {isAssistant &&
          message.status === 'answered' &&
          (message.sources?.length ?? 0) > 0 && (
            <div className="mt-3 space-y-2 text-left">
              <p className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-ink/50">
                <BookOpen className="h-3.5 w-3.5" />
                Study references
              </p>

              {message.sources?.map((source) => (
                <div
                  key={source.source_id}
                  className="rounded-xl border border-ink/10 bg-white p-3"
                >
                  <p className="text-sm font-semibold text-ink">
                    {source.title}
                  </p>

                  <p className="mt-1 text-xs text-ink/60">
                    {source.course_code} · Page {source.page_number}
                  </p>

                  {source.material_url && (
                    <a
                      href={source.material_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-coral hover:underline"
                    >
                      Open material
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}