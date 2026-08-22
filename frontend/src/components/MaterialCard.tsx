import { ArrowUpRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Material } from '../types/api'

export function MaterialCard({ material }: { material: Material }) {
  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-ink/10 bg-paper p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-coral/40">
      <div>
        <div className="mb-7 flex items-start justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
            <FileText size={19} />
          </span>
          <span className="rounded-full bg-moss/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-moss">
            {material.course_code}
          </span>
        </div>
        <h3 className="font-display text-xl font-semibold leading-tight">{material.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/60">
          {material.description || 'A useful resource for your next focused study session.'}
        </p>
      </div>
      <Link
        to={`/materials/${material.id}`}
        className="mt-8 flex items-center justify-between border-t border-ink/10 pt-4 text-sm font-bold text-coral"
      >
        View material{' '}
        <ArrowUpRight
          size={17}
          className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </Link>
    </article>
  )
}
