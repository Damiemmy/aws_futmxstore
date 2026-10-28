import { useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  MessageCircle,
  RotateCcw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { AbokiAvatar } from '../features/ai-assistant/components/AbokiAvatar'
import { ChatComposer } from '../features/ai-assistant/components/ChatComposer'
import { ChatMessage } from '../features/ai-assistant/components/ChatMessage'
import { SuggestedPrompts } from '../features/ai-assistant/components/SuggestedPrompts'
import { AcademicSearchPanel } from '../features/ai-assistant/components/AcademicSearchPanel'
import { useAbokiChat } from '../features/ai-assistant/hooks/useAbokiChat'

type AbokiTab = 'chat' | 'search'

export function Aboki() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation,
  } = useAbokiChat()

  const [activeTab, setActiveTab] = useState<AbokiTab>('chat')

  const conversationEndRef = useRef<HTMLDivElement>(null)

  const hasUserMessages = messages.some(
    (message) => message.role === 'user',
  )

  useEffect(() => {
    if (activeTab !== 'chat') return

    conversationEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, isLoading, activeTab])

  return (
    <AppShell>
      <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Page header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AbokiAvatar size="lg" />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Meet Aboki
                </h1>

                <span className="rounded-full bg-coral/10 px-2.5 py-1 text-xs font-semibold text-coral">
                  Study companion
                </span>
              </div>

              <p className="mt-1 text-sm text-ink/55">
                Your friendly companion for learning at FUTMinna.
              </p>
            </div>
          </div>

          {activeTab === 'chat' && (
            <button
              type="button"
              onClick={clearConversation}
              disabled={isLoading || !hasUserMessages}
              className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink/70 transition hover:border-coral/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
              New conversation
            </button>
          )}
        </header>

        {/* Workspace tabs */}
        <div
          role="tablist"
          aria-label="Aboki workspace"
          className="mb-5 grid grid-cols-2 gap-1.5 rounded-2xl border border-ink/10 bg-white p-1.5"
        >
          <button
            id="aboki-chat-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === 'chat'}
            aria-controls="aboki-chat-panel"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition sm:px-4 ${
              activeTab === 'chat'
                ? 'bg-ink text-white shadow-sm'
                : 'text-ink/60 hover:bg-paper hover:text-ink'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            Chat with Aboki
          </button>

          <button
            id="aboki-search-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === 'search'}
            aria-controls="aboki-search-panel"
            onClick={() => setActiveTab('search')}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition sm:px-4 ${
              activeTab === 'search'
                ? 'bg-ink text-white shadow-sm'
                : 'text-ink/60 hover:bg-paper hover:text-ink'
            }`}
          >
            <Search className="h-4 w-4" />
            Search materials
          </button>
        </div>

        {/* Chat workspace */}
        {activeTab === 'chat' && (
          <section
            id="aboki-chat-panel"
            role="tabpanel"
            aria-labelledby="aboki-chat-tab"
            className="flex min-h-[620px] flex-1 flex-col overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-sm"
          >
            {/* Chat status bar */}
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 bg-white/70 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                <span className="text-sm font-semibold text-ink">
                  Aboki AI
                </span>

                <span className="hidden text-xs text-ink/45 sm:inline">
                  · Academic assistance
                </span>
              </div>

              <span className="flex shrink-0 items-center gap-1.5 text-xs text-ink/50">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Evidence-aware answers
                </span>
                <span className="sm:hidden">Study AI</span>
              </span>
            </div>

            {/* Conversation messages */}
            <div
              className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <AbokiAvatar size="sm" />

                  <div className="rounded-2xl rounded-tl-md border border-ink/5 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-ink/60">
                      <MessageCircle className="h-4 w-4 text-coral" />

                      <span>Aboki is thinking</span>

                      <span
                        className="flex gap-1"
                        aria-label="Loading"
                      >
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-coral [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-coral [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-coral" />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={conversationEndRef} />
            </div>

            {/* Suggested prompts */}
            {!hasUserMessages && (
              <div className="px-4 pb-5 sm:px-6">
                <SuggestedPrompts
                  onSelect={sendMessage}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Message composer */}
            <div className="border-t border-ink/10 bg-white/70 p-4 sm:p-6">
              {error && (
                <p
                  role="alert"
                  className="mb-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <ChatComposer
                onSend={sendMessage}
                isLoading={isLoading}
              />

              <p className="mt-3 text-center text-xs leading-5 text-ink/40">
                Aboki uses indexed academic materials when relevant
                evidence is available. Verify important academic
                information against your course materials.
              </p>
            </div>
          </section>
        )}

        {/* Academic search workspace */}
        {activeTab === 'search' && (
          <section
            id="aboki-search-panel"
            role="tabpanel"
            aria-labelledby="aboki-search-tab"
            className="min-h-[620px] flex-1 rounded-3xl border border-ink/10 bg-paper p-4 shadow-sm sm:p-6 lg:p-8"
          >
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-coral/10">
                <BookOpen className="h-5 w-5 text-coral" />
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-ink">
                  Your academic library
                </h2>

                <p className="mt-1 text-sm leading-6 text-ink/55">
                  Find relevant passages from indexed study materials
                  and generate summaries of approved lecture notes.
                </p>
              </div>
            </div>

            <AcademicSearchPanel />
          </section>
        )}
      </main>
    </AppShell>
  )
}
