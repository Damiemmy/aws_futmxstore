import { BookOpen, ExternalLink, FileText } from 'lucide-react'
import type { AbokiSource } from '../types'

interface SourceCitationsProps {
  sources?: AbokiSource[]
}

export function SourceCitations({
  sources = [],
}: SourceCitationsProps) {
  if (sources.length === 0) {
    return null
  }

  return (
    <section
      aria-label="Sources used in this answer"
      className="mt-4 border-t border-ink/10 pt-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <BookOpen size={16} className="text-coral" />

        <h4 className="text-sm font-bold text-ink">
          Sources used
        </h4>

        <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-ink/60">
          {sources.length}
        </span>
      </div>

      <div className="space-y-2">
        {sources.map((source, index) => {
          const content = (
            <>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral/10 text-coral">
                <FileText size={17} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block break-words text-sm font-semibold text-ink">
                  {source.title || 'Academic material'}
                </span>

                <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink/55">
                  <span>
                    {source.source_id || `S${index + 1}`}
                  </span>

                  {source.course_code && (
                    <span>{source.course_code}</span>
                  )}

                  {source.page_number != null && (
                    <span>Page {source.page_number}</span>
                  )}
                </span>
              </span>

              {source.material_url && (
                <ExternalLink
                  size={16}
                  className="shrink-0 text-ink/40"
                />
              )}
            </>
          )

          const className =
            'flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper p-3 transition'

          return source.material_url ? (
            <a
              key={`${source.source_id}-${source.material_id}-${index}`}
              href={source.material_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${className} hover:border-coral/30 hover:bg-coral/5`}
            >
              {content}
            </a>
          ) : (
            <div
              key={`${source.source_id}-${source.material_id}-${index}`}
              className={className}
            >
              {content}
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-xs leading-5 text-ink/50">
        Consult these retrieved academic materials to explore
        the information behind Aboki's response.
      </p>
    </section>
  )
}