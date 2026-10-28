import { BookOpen, ExternalLink, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AbokiAvatar } from './AbokiAvatar'
import type { ChatMessageData } from '../types'

interface ChatMessageProps {
  message: ChatMessageData
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant'

  const hasSources =
    isAssistant &&
    message.status === 'answered' &&
    (message.sources?.length ?? 0) > 0

  return (
    <div
      className={`flex items-start gap-3 ${
        isAssistant ? '' : 'flex-row-reverse'
      }`}
    >
      {isAssistant ? (
        <AbokiAvatar
          size="sm"
          pose={
            message.status === 'answered'
              ? 'explaining'
              : message.status === 'conversation'
                ? 'encouraging'
                : 'idle'
          }
        />
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

        {/* Message content */}
        <div
          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 ${
            isAssistant
              ? 'rounded-tl-md border border-ink/5 bg-white text-ink shadow-sm'
              : 'rounded-tr-md bg-ink text-white'
          }`}
        >
          {message.content}
        </div>

        {/* Academic source references */}
        {hasSources && (
          <section
            aria-label="Academic sources"
            className="mt-3 space-y-2 text-left"
          >
            <p className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-ink/50">
              <BookOpen className="h-3.5 w-3.5" />
              Study references
              <span className="rounded-full bg-ink/5 px-2 py-0.5">
                {message.sources?.length}
              </span>
            </p>

            {message.sources?.map((source, index) => (
              <article
                key={`${source.source_id}-${source.material_id}-${index}`}
                className="rounded-xl border border-ink/10 bg-white p-3 shadow-sm transition hover:border-coral/20"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral/10 text-coral">
                    <FileText className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-ink">
                      {source.title || 'Academic material'}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-ink/55">
                      {source.course_code}
                      {source.page_number != null &&
                        ` · Page ${source.page_number}`}
                    </p>

                    <Link
                      to={`/materials/${source.material_id}`}
                      aria-label={`View material: ${source.title}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-coral transition hover:text-ink"
                    >
                      View material
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}