import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'

import { Link, useLocation } from 'react-router-dom'

import {
  MessageCircle,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  X,
} from 'lucide-react'

import { useAuthStore } from '../../../store/auth'

import { useAbokiChat } from '../hooks/useAbokiChat'
import { AbokiAvatar} from './AbokiAvatar'
import { AbokiPose } from '../types'
import { ChatMessage } from './ChatMessage'
import { AcademicSearchPanel } from './AcademicSearchPanel'

import './AbokiWidget.css'

type WidgetTab = 'chat' | 'search'

const suggestedPrompts = [
  'Explain a topic from my course',
  'Help me understand a difficult concept',
  'How can I prepare for an exam?',
]

export function AbokiWidget() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)

  const {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
  } = useAbokiChat()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<WidgetTab>('chat')
  const [draft, setDraft] = useState('')

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentPath =
    location.pathname.replace(/\/+$/, '') || '/'

  // The full Aboki workspace remains available on /aboki.
  // Keep the widget away from authentication screens.
  const hiddenRoutes = ['/aboki', '/login', '/register']
  const shouldHide = hiddenRoutes.includes(currentPath)

  const lastMessage = messages[messages.length - 1]

  // Choose Aboki's mascot pose for the current interaction.
  const avatarPose: AbokiPose = isLoading
    ? 'thinking'
    : activeTab === 'search'
      ? 'reading'
      : lastMessage?.role === 'assistant' &&
          lastMessage.id !== 'aboki-welcome'
        ? lastMessage.status === 'answered'
          ? 'explaining'
          : 'encouraging'
        : 'idle'

  useEffect(() => {
    if (!isOpen || activeTab !== 'chat') return

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [isOpen, activeTab, messages, isLoading])

  useEffect(() => {
    if (!isOpen || activeTab !== 'chat' || !user) return

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus()
    }, 100)

    return () => window.clearTimeout(timeout)
  }, [isOpen, activeTab, user])

  useEffect(() => {
    if (!isOpen) return

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const question = draft.trim()

    if (!question || isLoading || !user) return

    setDraft('')
    void sendMessage(question)
  }

  function handleInputKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  function handleSuggestedPrompt(prompt: string) {
    if (!user || isLoading) return

    void sendMessage(prompt)
  }

  if (shouldHide) {
    return null
  }

  return (
    <div className="aboki-widget-root">
      {isOpen && (
        <section
          id="aboki-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Aboki study assistant"
          className="aboki-widget-panel fixed inset-x-2 top-[max(0.5rem,env(safe-area-inset-top))] bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-[100] flex min-h-0 flex-col overflow-hidden rounded-[1.25rem] border border-violet-950/10 bg-white shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:top-auto sm:h-[min(680px,calc(100dvh-7.5rem))] sm:w-[390px] sm:rounded-[1.75rem]"
        >
          {/* Purple and gold header */}
          <header className="relative shrink-0 overflow-hidden bg-[#51258A] px-3 pb-3 pt-3 text-white sm:px-4 sm:pb-4 sm:pt-4">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-[#FFD34E]/15 blur-2xl"
            />

            <div className="relative flex items-center gap-2.5 sm:gap-3">
              <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 sm:h-12 sm:w-12">
                <AbokiAvatar
                  size="sm"
                  pose={!user ? 'waving' : avatarPose}
                />

                <span
                  aria-label="Aboki is available"
                  className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#51258A] bg-emerald-400"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-display text-lg font-bold sm:text-xl">
                    Aboki
                  </h2>

                  <Sparkles
                    size={15}
                    className="shrink-0 text-[#FFD34E]"
                  />
                </div>

                <p className="text-xs font-medium text-white/75">
                  Your academic AI friend
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/65">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Here to help you learn
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {user && (
                  <button
                    type="button"
                    onClick={clearConversation}
                    disabled={isLoading}
                    aria-label="Start a new conversation"
                    title="New conversation"
                    className="grid h-10 w-10 place-items-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Aboki"
                  className="grid h-10 w-10 place-items-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white sm:h-11 sm:w-11"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <p className="relative mt-3 text-xs leading-5 text-white/75">
              Ask questions, find study materials, and learn
              with confidence.
            </p>

            {/* Feature tabs */}
            {user && (
              <div
                role="tablist"
                aria-label="Aboki features"
                className="relative mt-3 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/10 p-1"
              >
                <button
                  id="aboki-chat-tab"
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'chat'}
                  aria-controls="aboki-chat-tabpanel"
                  onClick={() => setActiveTab('chat')}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold transition ${
                    activeTab === 'chat'
                      ? 'bg-white text-[#51258A] shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <MessageCircle size={16} />
                  Chat with Aboki
                </button>

                <button
                  id="aboki-search-tab"
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'search'}
                  aria-controls="aboki-search-tabpanel"
                  onClick={() => setActiveTab('search')}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold transition ${
                    activeTab === 'search'
                      ? 'bg-[#FFD34E] text-[#351052] shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Search size={16} />
                  Search materials
                </button>
              </div>
            )}

            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-1 w-full bg-[#FFD34E]"
            />
          </header>

          {/* Logged-out state */}
          {!user ? (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-[#FCFAFF] px-5 py-8 text-center">
              <div className="mb-4">
                <AbokiAvatar
                  size="lg"
                  pose="waving"
                />
              </div>

              <h3 className="font-display text-xl font-bold text-ink">
                Let's study together
              </h3>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-ink/60">
                Sign in to chat with Aboki, search academic
                materials, and generate summaries.
              </p>

              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#51258A] px-5 text-sm font-bold text-white transition hover:bg-violet-950"
              >
                Sign in to continue
              </Link>

              <p className="mt-3 text-xs text-ink/45">
                New to FUTMxStore?{' '}
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="font-semibold text-[#51258A] underline underline-offset-2"
                >
                  Create an account
                </Link>
              </p>
            </div>
          ) : activeTab === 'search' ? (
            /* Existing search and summarization experience */
            <div
              id="aboki-search-tabpanel"
              role="tabpanel"
              aria-labelledby="aboki-search-tab"
              className="min-h-0 flex-1 overflow-y-auto bg-[#FCFAFF] p-3 sm:p-4"
            >
              <AcademicSearchPanel />
            </div>
          ) : (
            /* Chat conversation */
            <>
              <div
                id="aboki-chat-tabpanel"
                role="tabpanel"
                aria-labelledby="aboki-chat-tab"
                className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#FCFAFF] px-3 py-4 sm:px-4"
              >
                <div
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions text"
                  aria-label="Conversation with Aboki"
                  className="space-y-4"
                >
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                    />
                  ))}
                </div>

                {messages.length === 1 && !isLoading && (
                  <div className="ml-11 mt-4 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                      Try asking
                    </p>

                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSuggestedPrompt(prompt)}
                        className="block min-h-10 w-full rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-left text-xs font-medium leading-5 text-[#51258A] transition hover:border-violet-300 hover:bg-violet-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div
                    role="status"
                    className="mt-4 ml-11 flex items-center gap-2 rounded-2xl rounded-tl-md border border-violet-100 bg-white px-3 py-3 text-xs text-ink/60 shadow-sm"
                  >
                    <span className="flex gap-1">
                      <span className="aboki-typing-dot h-1.5 w-1.5 rounded-full bg-[#51258A]" />
                      <span className="aboki-typing-dot h-1.5 w-1.5 rounded-full bg-[#51258A]" />
                      <span className="aboki-typing-dot h-1.5 w-1.5 rounded-full bg-[#51258A]" />
                    </span>

                    Aboki is finding relevant passages...
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat composer */}
              <div className="shrink-0 border-t border-violet-100 bg-white p-3 sm:p-4">
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-violet-200 bg-[#FCFAFF] p-2 transition focus-within:border-[#51258A] focus-within:ring-2 focus-within:ring-violet-100"
                >
                  <label
                    className="sr-only"
                    htmlFor="aboki-widget-input"
                  >
                    Ask Aboki a study question
                  </label>

                  <textarea
                    ref={inputRef}
                    id="aboki-widget-input"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Ask Aboki anything..."
                    rows={2}
                    maxLength={1000}
                    disabled={isLoading}
                    className="max-h-28 min-h-12 w-full resize-none bg-transparent px-2 py-1.5 text-base leading-6 text-ink outline-none placeholder:text-ink/40 disabled:opacity-60 sm:text-sm"
                  />

                  <div className="flex items-center justify-between gap-2 px-1 pb-1">
                    <span className="text-[10px] leading-4 text-ink/40">
                      Enter to send
                      <span className="hidden sm:inline">
                        {' '}· Shift + Enter for a new line
                      </span>
                    </span>

                    <button
                      type="submit"
                      disabled={!draft.trim() || isLoading}
                      aria-label="Send message to Aboki"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#51258A] text-white shadow-sm transition hover:bg-violet-950 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Send size={17} />
                    </button>
                  </div>
                </form>

                <p className="mt-2 text-center text-[10px] text-ink/40">
                  Powered by your FUTMxStore academic assistant
                </p>
              </div>
            </>
          )}
        </section>
      )}

      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Close Aboki assistant' : 'Chat with Aboki'}
        aria-expanded={isOpen}
        aria-controls="aboki-chat-panel"
        title="Chat with Aboki"
        className={`aboki-float-launcher fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-[calc(env(safe-area-inset-right)+1rem)] z-[101] grid h-[66px] w-[66px] place-items-center rounded-[23px] border-2 border-white/90 bg-[#51258A] shadow-[0_12px_36px_rgba(64,30,104,0.38)] ring-1 ring-violet-950/10 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_16px_42px_rgba(64,30,104,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD34E]`}
      >
        {isOpen ? (
          <X size={25} className="text-white" />
        ) : (
          <>
            <AbokiAvatar
              size="md"
              pose={avatarPose}
            />

            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-[#FFD34E] text-[#51258A] shadow-sm"
            >
              <MessageCircle size={12} strokeWidth={2.7} />
            </span>

            <span className="absolute -top-2 right-0 hidden -translate-y-full whitespace-nowrap rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-bold text-[#51258A] shadow-lg sm:block">
              Ask Aboki
            </span>
          </>
        )}
      </button>
    </div>
  )
}