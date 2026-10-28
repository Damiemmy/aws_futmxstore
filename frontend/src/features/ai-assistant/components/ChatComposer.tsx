import { FormEvent, KeyboardEvent, useState } from 'react'
import { ArrowUp, LoaderCircle } from 'lucide-react'


interface ChatComposerProps {
  onSend: (message: string) => Promise<void>
  isLoading: boolean
}

export function ChatComposer({
  onSend,
  isLoading,
}: ChatComposerProps) {
  const [value, setValue] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const message = value.trim()

    if (!message || isLoading) return

    setValue('')
    await onSend(message)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-2xl border border-ink/10 bg-white p-2 shadow-sm transition focus-within:border-coral/50 focus-within:ring-2 focus-within:ring-coral/10">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={2}
          maxLength={1000}
          placeholder="Ask Aboki anything about your studies..."
          aria-label="Message Aboki"
          className="max-h-36 min-h-14 w-full resize-y bg-transparent px-3 py-2 text-sm leading-6 text-ink outline-none placeholder:text-ink/40 disabled:opacity-60"
        />

        <div className="flex items-center justify-between gap-3 px-2 pb-1">
          <p className="text-xs text-ink/40">
            Enter to send · Shift+Enter for a new line
          </p>

          <button
            type="submit"
            disabled={!value.trim() || isLoading}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </form>
  )
}