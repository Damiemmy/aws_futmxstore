import {
  BookOpen,
  FileText,
  Search,
  Sparkles,
} from 'lucide-react'

const prompts = [
  {
    icon: BookOpen,
    label: 'Explain a concept',
    prompt: 'Explain a difficult academic concept in simple terms.',
  },
  {
    icon: Search,
    label: 'Find study materials',
    prompt: 'Help me find relevant study materials for my question.',
  },
  {
    icon: FileText,
    label: 'Study more effectively',
    prompt: 'How can I use my lecture notes to prepare for an exam?',
  },
]

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
  disabled?: boolean
}

export function SuggestedPrompts({
  onSelect,
  disabled = false,
}: SuggestedPromptsProps) {
  return (
    <div className="w-full">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
        <Sparkles className="h-3.5 w-3.5 text-coral" />
        Try asking
      </p>

      <div className="grid gap-2 sm:grid-cols-3">
        {prompts.map(({ icon: Icon, label, prompt }) => (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(prompt)}
            className="group rounded-xl border border-ink/10 bg-white p-3 text-left transition hover:border-coral/40 hover:bg-coral/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon className="mb-3 h-5 w-5 text-coral" />

            <span className="block text-sm font-semibold text-ink">
              {label}
            </span>

            <span className="mt-1 block text-xs leading-5 text-ink/55">
              {prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}