import { BookOpen, LogOut, UploadCloud } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const canUpload = user?.roles.some((role) =>
    ['Course Representative', 'Lecturer', 'Admin'].includes(role),
  )
  return (
    <div className="min-h-screen paper-grid">
      <header className="border-b border-ink/10 bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-cream">
              <BookOpen size={20} />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">
              FUTMx<span className="text-coral">Store</span>
            </span>
          </Link>
          <nav className="flex items-center gap-3 text-sm font-semibold">
            {user ? (
              <>
                <span className="hidden text-ink/60 sm:inline">
                  Hello, {user.username || user.email.split('@')[0]}
                </span>
                {canUpload && (
                  <Link
                    to="/upload"
                    className="hidden items-center gap-2 rounded-full border border-ink/20 px-4 py-2 transition hover:bg-ink hover:text-cream sm:flex"
                  >
                    <UploadCloud size={16} /> Upload
                  </Link>
                )}
                <button
                  onClick={() => {
                    void signOut()
                    navigate('/')
                  }}
                  className="flex items-center gap-2 rounded-full px-3 py-2 text-ink/70 hover:bg-ink/10"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full px-4 py-2 hover:bg-ink/10">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-coral px-4 py-2 text-white shadow-sm transition hover:bg-ink"
                >
                  Join free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      {children}
      <footer className="mx-auto max-w-7xl border-t border-ink/10 px-5 py-8 text-sm text-ink/55 lg:px-8">
        <span className="font-display font-bold text-ink">FUTMxStore</span> · Find what moves your
        studies forward.
      </footer>
    </div>
  )
}
