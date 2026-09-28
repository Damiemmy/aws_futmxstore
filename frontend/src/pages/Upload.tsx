import {
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
  Plus,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function Upload() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-cream px-3 py-5 sm:px-5 sm:py-10">
      {/* Decorative academic background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-ink/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl">
        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-lg px-1 text-sm font-bold text-ink/55 transition-colors hover:text-ink sm:mb-10"
        >
          <ArrowRight size={16} className="rotate-180" />
          Back to library
        </Link>

        {/* Main card */}
        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-soft">
          {/* Hero */}
          <div className="relative overflow-hidden px-5 pb-8 pt-7 sm:px-10 sm:pb-10 sm:pt-10">
            {/* Decorative book illustration */}
            <div className="pointer-events-none absolute -right-8 -top-8 hidden h-40 w-40 rotate-12 rounded-[2.5rem] bg-coral/5 sm:block" />

            <div className="relative flex items-start justify-between gap-5">
              <div className="min-w-0">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-coral">
                  <Sparkles size={13} />
                  Student contribution
                </div>

                <h1 className="max-w-xl font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
                  Help build the library.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-ink/60 sm:text-base sm:leading-7">
                  Every note, past question, tutorial, and course you add can
                  save another student hours of searching.
                </p>
              </div>

              <div className="hidden shrink-0 sm:flex">
                <div className="flex h-16 w-16 rotate-3 items-center justify-center rounded-2xl bg-coral/10 text-coral shadow-sm">
                  <GraduationCap size={32} strokeWidth={1.7} />
                </div>
              </div>
            </div>

            {/* Contribution principle */}
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-ink/5 bg-cream/70 p-4 sm:mt-8 sm:p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paper text-coral shadow-sm">
                <Plus size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-ink">
                  See something missing?
                </p>

                <p className="mt-1 text-xs leading-5 text-ink/55 sm:text-sm">
                  Don't leave the library incomplete. You can add the missing
                  course and continue your contribution immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="border-t border-ink/10 bg-cream/40 p-3 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Upload material */}
              <Link
                to="/upload/material"
                className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-paper p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-soft active:translate-y-0 sm:p-6"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-coral/5 transition-transform duration-300 group-hover:scale-125" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-coral/10 text-coral">
                      <FileText size={23} />
                    </div>

                    <ArrowRight
                      size={19}
                      className="text-ink/25 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-coral"
                    />
                  </div>

                  <h2 className="mt-6 text-lg font-bold text-ink sm:text-xl">
                    Upload material
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-ink/55">
                    Share lecture notes, slides, handouts, tutorials, past
                    questions, and other useful resources.
                  </p>

                  <div className="mt-5 text-xs font-bold uppercase tracking-wider text-coral">
                    Start contributing
                  </div>
                </div>
              </Link>

              {/* Add course */}
              <Link
                to="/upload/course"
                className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-paper p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-soft active:translate-y-0 sm:p-6"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-ink/5 transition-transform duration-300 group-hover:scale-125" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink/5 text-ink">
                      <BookOpen size={23} />
                    </div>

                    <ArrowRight
                      size={19}
                      className="text-ink/25 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-coral"
                    />
                  </div>

                  <h2 className="mt-6 text-lg font-bold text-ink sm:text-xl">
                    Add a course
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-ink/55">
                    Can't find your course? Add it to FUTMxStore and then
                    continue straight to your material upload.
                  </p>

                  <div className="mt-5 text-xs font-bold uppercase tracking-wider text-coral">
                    Add missing course
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Bottom message */}
          <div className="flex items-center gap-3 border-t border-ink/10 px-5 py-4 sm:px-8">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-coral/10 text-coral">
              <BookOpen size={15} />
            </div>

            <p className="text-xs leading-5 text-ink/50 sm:text-sm">
              Built by students, strengthened by students.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}