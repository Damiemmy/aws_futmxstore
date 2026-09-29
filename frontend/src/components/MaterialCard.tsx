import { ArrowUpRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Material } from '../types/api'

export function MaterialCard({
  material,
}: {
  material: Material
}) {
  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] border border-ink/10 bg-paper p-5 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-coral/25 hover:shadow-[0_18px_45px_rgba(0,0,0,0.09)] sm:rounded-[1.75rem] sm:p-6">

      {/* Animated accent */}
      <div className="absolute left-0 top-0 h-1 w-0 bg-coral transition-all duration-500 group-hover:w-full" />

      {/* Soft background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-coral/5 blur-2xl transition duration-500 group-hover:bg-coral/10" />

      <div className="relative">

        {/* Top row */}
        <div className="mb-8 flex items-start justify-between gap-4">

          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold transition duration-300 group-hover:rotate-[-4deg] group-hover:scale-105">
            <FileText
              size={19}
              strokeWidth={1.8}
            />
          </div>

          <span className="max-w-[65%] truncate rounded-full border border-moss/10 bg-moss/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-moss">
            {material.course_code}
          </span>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-display text-xl font-semibold leading-[1.08] tracking-tight text-ink transition-colors duration-300 group-hover:text-coral sm:text-[1.35rem]">
            {material.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/55">
            {material.description ||
              'A useful resource for your next focused study session.'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <Link
        to={`/materials/${material.id}`}
        className="group/link mt-8 flex min-h-11 items-center justify-between border-t border-ink/10 pt-4 text-sm font-bold text-coral"
      >
        <span className="transition-transform duration-300 group-hover/link:translate-x-0.5">
          View material
        </span>

        <span className="grid h-8 w-8 place-items-center rounded-full bg-coral/10 transition-all duration-300 group-hover/link:bg-coral group-hover/link:text-white">
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </span>
      </Link>
    </article>
  )
}