import {
  BookOpen,
  LogOut,
  UploadCloud,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuthStore } from '../store/auth'

export function AppShell({
  children,
}: {
  children: ReactNode
}) {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const canUpload = user?.roles.some((role) =>
    [
      'Course Representative',
      'Lecturer',
      'Admin',
    ].includes(role),
  )

  return (
    <div className="min-h-screen overflow-x-hidden paper-grid">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-xl">

        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-3 sm:min-h-[76px] sm:px-5 lg:px-8">

          {/* Brand */}
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-cream shadow-sm transition duration-300 group-hover:-rotate-3 group-hover:scale-105 sm:h-11 sm:w-11">

              <BookOpen
                size={19}
                strokeWidth={1.8}
              />

              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-coral opacity-0 transition duration-300 group-hover:opacity-100" />
            </span>

            <span className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">
              FUTMx<span className="text-coral">Store</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1.5 text-sm font-semibold sm:gap-2">

            {user ? (
              <>
                {/* Greeting - desktop */}
                <span className="hidden max-w-[180px] truncate px-2 text-xs text-ink/50 lg:block">
                  Hello, {user.username || user.email.split('@')[0]}
                </span>

                {/* Upload */}
                {canUpload && (
                  <Link
                    to="/upload"
                    className="group inline-flex min-h-10 items-center gap-2 rounded-xl border border-ink/10 bg-paper px-3 text-ink transition duration-300 hover:-translate-y-0.5 hover:border-coral/20 hover:bg-ink hover:text-cream sm:px-4"
                  >
                    <UploadCloud
                      size={16}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5"
                    />

                    <span className="hidden sm:inline">
                      Upload
                    </span>
                  </Link>
                )}

                {/* Sign out */}
                <button
                  type="button"
                  onClick={() => {
                    void signOut()
                    navigate('/')
                  }}
                  className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-2.5 text-ink/55 transition duration-300 hover:bg-ink/5 hover:text-ink sm:px-3"
                  aria-label="Sign out"
                >
                  <LogOut
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />

                  <span className="hidden sm:inline">
                    Sign out
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Sign in */}
                <Link
                  to="/login"
                  className="inline-flex min-h-10 items-center rounded-xl px-3 text-sm text-ink/65 transition duration-300 hover:bg-ink/5 hover:text-ink sm:px-4"
                >
                  Sign in
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="inline-flex min-h-10 items-center rounded-xl bg-coral px-3.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-ink hover:shadow-md sm:px-4"
                >
                  Join free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* =========================================================
          PAGE CONTENT
      ========================================================== */}

      {children}

      {/* =========================================================
          FOOTER
      ========================================================== */}

      <footer className="mx-auto max-w-7xl px-3 pb-8 pt-6 text-sm text-ink/45 sm:px-5 sm:pb-10 sm:pt-8 lg:px-8">

        <div className="flex flex-col gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <span className="font-display font-bold text-ink">
              FUTMxStore
            </span>

            <span className="ml-1">
              · Find what moves your studies forward.
            </span>
          </div>

          <div className="text-xs text-ink/35">
            Built for the FUT Minna community.
          </div>
        </div>
      </footer>
    </div>
  )
}
