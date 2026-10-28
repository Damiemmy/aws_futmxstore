import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  FileText,
  LoaderCircle,
  Search,
  Sparkles,
} from 'lucide-react'

import {
  searchAcademicMaterials,
  summarizeMaterial,
} from '../services'

import type {
  MaterialSummaryResult,
  RetrievedChunk,
} from '../types'

export function AcademicSearchPanel() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<RetrievedChunk[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const [summarizingId, setSummarizingId] = useState<number | null>(
    null,
  )

  const [summaries, setSummaries] = useState<
    Record<number, MaterialSummaryResult>
  >({})

  const [summaryErrors, setSummaryErrors] = useState<
    Record<number, string>
  >({})

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanedQuery = query.trim()

    if (!cleanedQuery || isSearching) return

    setIsSearching(true)
    setSearchError(null)
    setHasSearched(false)
    setResults([])

    try {
      const response = await searchAcademicMaterials({
        query: cleanedQuery,
        top_k: 5,
      })

      setResults(response.results)
      setHasSearched(true)
    } catch {
      setSearchError(
        'We could not complete your search. Please try again.',
      )
    } finally {
      setIsSearching(false)
    }
  }

  async function handleSummarize(materialId: number) {
    if (summarizingId !== null) return

    setSummarizingId(materialId)

    setSummaryErrors((current) => {
      const next = { ...current }
      delete next[materialId]
      return next
    })

    try {
      const response = await summarizeMaterial(materialId)

      setSummaries((current) => ({
        ...current,
        [materialId]: response,
      }))
    } catch {
      setSummaryErrors((current) => ({
        ...current,
        [materialId]:
          'Could not summarize this material. Please try again.',
      }))
    } finally {
      setSummarizingId(null)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Search className="h-5 w-5 text-coral" />

          <h2 className="font-display text-xl font-bold text-ink">
            Search study materials
          </h2>
        </div>

        <p className="text-sm leading-6 text-ink/60">
          Search the indexed academic resources and explore the
          passages most relevant to your question.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-ink/10 bg-white px-3 focus-within:border-coral/50 focus-within:ring-2 focus-within:ring-coral/10">
          <Search className="h-4 w-4 shrink-0 text-ink/40" />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={1000}
            placeholder="e.g. Explain database normalization"
            aria-label="Search academic materials"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ink outline-none placeholder:text-ink/40"
          />
        </div>

        <button
          type="submit"
          disabled={!query.trim() || isSearching}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSearching ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}

          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {searchError && (
        <p role="alert" className="text-sm text-red-600">
          {searchError}
        </p>
      )}

      {isSearching && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl bg-white p-5 text-sm text-ink/60"
        >
          <LoaderCircle className="h-5 w-5 animate-spin text-coral" />
          Searching indexed materials...
        </div>
      )}

      {hasSearched && !isSearching && results.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white/60 px-5 py-10 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-ink/30" />

          <h3 className="font-semibold text-ink">
            No matching passages found
          </h3>

          <p className="mt-2 text-sm leading-6 text-ink/55">
            Try different keywords or ask a more specific question.
            Only indexed materials can appear in these results.
          </p>
        </div>
      )}

      {hasSearched && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
            {results.length} matching passage
            {results.length === 1 ? '' : 's'}
          </p>

          {results.map((result) => {
            const summary = summaries[result.material_id]

            const isSummarizing =
              summarizingId === result.material_id

            return (
              <article
                key={result.chunk_id}
                className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral/10">
                    <FileText className="h-5 w-5 text-coral" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-6 text-ink">
                      {result.material_title}
                    </h3>

                    <p className="mt-1 text-xs text-ink/55">
                      {result.course_code} · Page {result.page_number}
                    </p>
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-ink/75">
                  {result.text}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ink/5 pt-3">
                  <Link
                    to={`/materials/${result.material_id}`}
                    aria-label={`View material: ${result.material_title}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/70 transition hover:text-coral"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    View material
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleSummarize(result.material_id)
                    }
                    disabled={summarizingId !== null}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-coral/10 px-3 py-2 text-xs font-semibold text-coral transition hover:bg-coral/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSummarizing ? (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}

                    {isSummarizing
                      ? 'Summarizing...'
                      : 'Summarize material'}
                  </button>
                </div>

                {summaryErrors[result.material_id] && (
                  <p
                    role="alert"
                    className="mt-3 text-sm text-red-600"
                  >
                    {summaryErrors[result.material_id]}
                  </p>
                )}

                {summary && (
                  <div className="mt-4 rounded-xl bg-paper p-4">
                    {summary.status === 'summarized' ? (
                      <>
                        <div className="mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-coral" />

                          <h4 className="font-semibold text-ink">
                            Summary: {summary.title}
                          </h4>
                        </div>

                        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-ink/75">
                          {summary.summary}
                        </p>

                        <p className="mt-3 text-xs text-ink/45">
                          {summary.pages_processed} page
                          {summary.pages_processed === 1 ? '' : 's'}{' '}
                          processed
                        </p>
                      </>
                    ) : (
                      <p className="text-sm leading-6 text-ink/70">
                        {summary.message}
                      </p>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
