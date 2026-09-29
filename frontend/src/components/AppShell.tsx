import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  LogOut,
  Menu,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, type ReactNode } from 'react'

import { useAuthStore } from '../store/auth'

export function AppShell({
  children,
}: {
  children: ReactNode
}) {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const canUpload = user?.roles.some((role) =>
    [
      'Course Representative',
      'Lecturer',
      'Admin',
      'Customer',
    ].includes(role),
  )

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const handleSignOut = () => {
    closeMobileMenu()
    void signOut()
    navigate('/')
  }

  const displayName = user
    ? user.username || user.email.split('@')[0]
    : ''

  return (
    <div className="min-h-screen overflow-x-hidden paper-grid">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-xl">

        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-3 sm:min-h-[76px] sm:px-5 lg:px-8">

          {/* =====================================================
              BRAND
          ====================================================== */}

          <Link
            to="/"
            onClick={closeMobileMenu}
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

          {/* =====================================================
              DESKTOP / TABLET NAVIGATION
          ====================================================== */}

          <nav className="hidden items-center gap-1.5 text-sm font-semibold sm:flex sm:gap-2">

            {user ? (
              <>
                {/* Greeting */}
                <span className="hidden max-w-[180px] truncate px-2 text-xs text-ink/50 lg:block">
                  Hello, {displayName}
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

                    <span>
                      Upload
                    </span>
                  </Link>
                )}

                {/* Sign out */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-2.5 text-ink/55 transition duration-300 hover:bg-ink/5 hover:text-ink sm:px-3"
                  aria-label="Sign out"
                >
                  <LogOut
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />

                  <span>
                    Sign out
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Sign in */}
                <Link
                  to="/login"
                  className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm text-ink/65 transition duration-300 hover:bg-ink/5 hover:text-ink sm:px-4"
                >
                  Sign in
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="inline-flex min-h-10 items-center justify-center rounded-xl bg-coral px-3.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-ink hover:shadow-md sm:px-4"
                >
                  Join free
                </Link>
              </>
            )}
          </nav>

          {/* =====================================================
              MOBILE CONTROLS
          ====================================================== */}

          <div className="flex items-center gap-2 sm:hidden">

            {/* ===================================================
                UPLOAD ICON — ALWAYS VISIBLE FOR AUTHORIZED USERS
            ==================================================== */}

            {user && canUpload && (
              <Link
                to="/upload"
                aria-label="Upload material"
                className="group grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink/10 bg-paper text-ink shadow-sm transition duration-300 hover:border-coral/20 hover:bg-ink hover:text-cream"
              >
                <UploadCloud
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </Link>
            )}

            {/* ===================================================
                MOBILE MENU BUTTON
            ==================================================== */}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={
                mobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-cream shadow-sm transition duration-300 hover:bg-coral"
            >
              {mobileMenuOpen ? (
                <X size={19} />
              ) : (
                <Menu size={19} />
              )}
            </button>
          </div>
        </div>

        {/* =========================================================
            MOBILE MENU
        ========================================================== */}

        <div
          className={`sm:hidden ${
            mobileMenuOpen
              ? 'grid grid-rows-[1fr]'
              : 'grid grid-rows-[0fr]'
          } transition-[grid-template-rows] duration-300 ease-out`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-ink/10 bg-cream px-3 pb-4 pt-3">

              {user ? (
                <div className="space-y-2">

                  {/* User identity */}
                  <div className="mb-3 flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper p-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-cream">
                      <BookOpen size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/35">
                        Signed in as
                      </p>

                      <p className="truncate text-sm font-bold text-ink">
                        {displayName}
                      </p>
                    </div>
                  </div>

                  {/* Upload */}
                  {canUpload && (
                    <Link
                      to="/upload"
                      onClick={closeMobileMenu}
                      className="group flex min-h-12 items-center justify-between rounded-xl border border-ink/10 bg-paper px-4 text-sm font-bold text-ink transition duration-200 hover:bg-ink hover:text-cream"
                    >
                      <span className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-coral/10 text-coral group-hover:bg-white/10 group-hover:text-coral">
                          <UploadCloud size={16} />
                        </span>

                        Upload material
                      </span>

                      <ChevronRight
                        size={17}
                        className="text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-cream/60"
                      />
                    </Link>
                  )}

                  {/* Sign out */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="group flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-sm font-semibold text-ink/60 transition duration-200 hover:bg-ink/5 hover:text-ink"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink/5">
                        <LogOut size={16} />
                      </span>

                      Sign out
                    </span>

                    <ChevronRight
                      size={17}
                      className="text-ink/25 transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">

                  {/* Welcome message */}
                  <div className="mb-3 rounded-2xl bg-ink p-4 text-cream">
                    <div className="mb-3 flex items-center gap-2 text-gold">
                      <Sparkles size={15} />

                      <span className="text-[11px] font-bold uppercase tracking-[0.14em]">
                        Welcome to FUTMxStore
                      </span>
                    </div>

                    <p className="font-display text-xl leading-tight">
                      Your academic shelf,
                      <br />
                      wherever you study.
                    </p>
                  </div>

                  {/* Sign in */}
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="group flex min-h-12 items-center justify-between rounded-xl border border-ink/10 bg-paper px-4 text-sm font-bold text-ink transition duration-200 hover:border-ink/20 hover:bg-ink hover:text-cream"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink/5 group-hover:bg-white/10">
                        <BookOpen size={16} />
                      </span>

                      Sign in
                    </span>

                    <ArrowRight
                      size={17}
                      className="text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-cream/60"
                    />
                  </Link>

                  {/* Join free */}
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="group flex min-h-12 items-center justify-between rounded-xl bg-coral px-4 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-ink"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
                        <Sparkles size={16} />
                      </span>

                      Join free
                    </span>

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          PAGE CONTENT
      ========================================================== */}

      {children}

      {/* =========================================================
          FOOTER
      ========================================================== */}

      <footer className="mx-auto max-w-7xl px-3 pb-7 pt-8 sm:px-5 sm:pb-10 sm:pt-10 lg:px-8">

        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-ink text-cream shadow-soft">

          {/* =====================================================
              FOOTER TOP
          ====================================================== */}

          <div className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-10">

            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-coral/15 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

              {/* Brand */}
              <div className="max-w-xl">

                <Link
                  to="/"
                  className="group inline-flex items-center gap-3"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-ink transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
                    <BookOpen size={18} />
                  </span>

                  <span className="font-display text-xl font-bold">
                    FUTMx<span className="text-coral">Store</span>
                  </span>
                </Link>

                <p className="mt-4 max-w-lg text-sm leading-6 text-cream/50 sm:text-base">
                  A focused academic resource space for the FUT Minna
                  community. Find what you need, keep learning, and
                  move your studies forward.
                </p>
              </div>

              {/* CTA */}
              <div className="lg:text-right">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
                  Keep moving
                </p>

                <Link
                  to="/"
                  className="group mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-coral px-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-cream hover:text-ink"
                >
                  Explore the library

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* =====================================================
              FOOTER BOTTOM
          ====================================================== */}

          <div className="border-t border-white/10 px-5 py-5 sm:px-8 lg:px-10">

            <div className="flex flex-col gap-3 text-xs text-cream/35 sm:flex-row sm:items-center sm:justify-between">

              <p>
                © {new Date().getFullYear()} FUTMxStore
              </p>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Built for the</span>

                <span className="font-semibold text-cream/55">
                  FUT Minna community
                </span>

                <span>·</span>

                <span>
                  Find what moves your studies forward.
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}