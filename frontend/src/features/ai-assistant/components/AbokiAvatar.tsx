import { Sparkles } from 'lucide-react'

interface AbokiAvatarProps {
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'h-9 w-9 text-lg',
  md: 'h-12 w-12 text-2xl',
  lg: 'h-20 w-20 text-4xl',
}

export function AbokiAvatar({ size = 'md' }: AbokiAvatarProps) {
  return (
    <div
      aria-label="Aboki study assistant"
      className={`relative flex shrink-0 items-center justify-center rounded-2xl bg-coral/10 ${sizes[size]}`}
    >
      <span role="img" aria-label="Friendly study companion">
        🦉
      </span>

      <Sparkles
        aria-hidden="true"
        className="absolute -right-1 -top-1 h-4 w-4 text-coral"
      />
    </div>
  )
}