import { AbokiPose } from "../types"

interface AbokiAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  pose?: AbokiPose
}

const sizes = {
  sm: 'h-10 w-9',
  md: 'h-14 w-12',
  lg: 'h-24 w-20',
} as const

const poseAssets: Record<AbokiPose, string> = {
  idle: '/assets/aboki/aboki-idle.png',
  waving: '/assets/aboki/aboki-waving.png',
  thinking: '/assets/aboki/aboki-thinking.png',
  celebrating: '/assets/aboki/aboki-celebrating.png',
  explaining: '/assets/aboki/aboki-explaining.png',
  reading: '/assets/aboki/aboki-reading.png',
  pointing: '/assets/aboki/aboki-pointing.png',
  happy: '/assets/aboki/aboki-happy.png',
  encouraging: '/assets/aboki/aboki-encouraging.png',
  concerned: '/assets/aboki/aboki-concerned.png',
  studying: '/assets/aboki/aboki-studying.png',
  books: '/assets/aboki/aboki-books.png',
  goodbye: '/assets/aboki/aboki-goodbye.png',
}

interface AvatarImageProps {
  pose: AbokiPose
}

function AvatarImage({ pose }: AvatarImageProps) {
  return (
    <img
      src={poseAssets[pose]}
      alt=""
      draggable={false}
      decoding="async"
      className="aboki-avatar-image pointer-events-none h-full w-full select-none object-contain object-bottom"
    />
  )
}

export function AbokiAvatar({
  size = 'md',
  pose = 'idle',
}: AbokiAvatarProps) {
  return (
    <div
      role="img"
      aria-label={`Aboki study assistant: ${pose}`}
      data-pose={pose}
      className={[
        'aboki-avatar',
        `aboki-avatar--${pose}`,
        'relative flex shrink-0 items-end justify-center',
        sizes[size],
      ].join(' ')}
    >
      <AvatarImage pose={pose} />
    </div>
  )
}