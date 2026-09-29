import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Library,
  Sparkles,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { getApiMessage } from '../api/client'
import { useAuthStore } from '../store/auth'

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

type FormValues = z.infer<typeof schema>

export function Login() {
  const signIn = useAuthStore((s) => s.signIn)
  const navigate = useNavigate()
  const location = useLocation()

  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const from =
    (location.state as { from?: string } | null)?.from || '/'

  return (
    <AuthFrame
      title="Welcome back."
      subtitle="Your study shelf is waiting for you."
    >
      <form
        onSubmit={handleSubmit(async (values) => {
          setError('')

          try {
            await signIn(values)

            navigate(from, {
              replace: true,
            })
          } catch (e) {
            setError(
              getApiMessage(
                e,
                'We could not sign you in. Check your details.',
              ),
            )
          }
        })}
        className="space-y-5"
      >
        <Field
          label="Email"
          hint="Your registered email"
          error={errors.email?.message}
        >
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('email')}
          />
        </Field>

        <Field
          label="Password"
          error={errors.password?.message}
        >
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            {...register('password')}
          />
        </Field>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-coral/10 bg-coral/10 p-4 text-sm leading-6 text-coral"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-coral px-5 font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            'Opening your shelf...'
          ) : (
            <>
              Sign in
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </form>

      {/* Welcome strip */}
      <div className="mt-7 rounded-2xl border border-ink/10 bg-paper p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
            <CheckCircle2 size={17} />
          </div>

          <div>
            <p className="text-sm font-bold text-ink">
              Your resources are waiting.
            </p>

            <p className="mt-1 text-xs leading-5 text-ink/50">
              Sign in to continue exploring, downloading, and sharing
              academic materials.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7 border-t border-ink/10 pt-6 text-center">
        <p className="text-sm text-ink/60">
          New to FUTMxStore?{' '}
          <Link
            className="font-bold text-coral transition hover:text-ink"
            to="/register"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthFrame>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block text-sm font-semibold">
      <div className="flex items-baseline justify-between gap-3">
        <span>{label}</span>

        {hint && !error && (
          <span className="text-[11px] font-normal text-ink/40">
            {hint}
          </span>
        )}
      </div>

      <span className="mt-2 block [&>input]:min-h-12 [&>input]:w-full [&>input]:rounded-xl [&>input]:border [&>input]:border-ink/15 [&>input]:bg-cream [&>input]:px-4 [&>input]:text-sm [&>input]:text-ink [&>input]:outline-none [&>input]:transition [&>input]:placeholder:text-ink/30 [&>input]:focus:border-coral [&>input]:focus:ring-4 [&>input]:focus:ring-coral/10">
        {children}
      </span>

      {error && (
        <span className="mt-1.5 block text-xs font-normal text-coral">
          {error}
        </span>
      )}
    </label>
  )
}

function AuthFrame({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      {/* Desktop brand panel */}
      <div className="relative hidden overflow-hidden bg-ink p-12 text-cream lg:flex lg:flex-col lg:justify-between xl:p-16">
        {/* Atmospheric background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-coral/20 blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:48px_48px]" />

          {/* Decorative rings */}
          <div className="absolute right-[-8rem] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full border border-white/10" />

          <div className="absolute right-[-4rem] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-white/5" />
        </div>

        {/* Brand */}
        <Link
          to="/"
          className="relative z-10 inline-flex w-fit font-display text-xl font-bold transition hover:text-white"
        >
          FUTMx<span className="text-coral">Store</span>
        </Link>

        {/* Main message */}
        <div className="relative z-10 max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-gold backdrop-blur">
            <Sparkles size={14} />
            Welcome back
          </div>

          <p className="font-display text-6xl leading-[0.95] xl:text-7xl">
            A better shelf
            <br />
            for every semester.
          </p>

          <p className="mt-7 max-w-md text-base leading-7 text-cream/50">
            Pick up where you left off. Find course materials, discover
            useful resources, and keep your academic journey moving.
          </p>

          {/* Mini library visual */}
          <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
            <Feature
              icon={<Library size={17} />}
              label="Discover"
            />

            <Feature
              icon={<BookOpen size={17} />}
              label="Study"
            />

            <Feature
              icon={<Sparkles size={17} />}
              label="Share"
            />
          </div>
        </div>

        <p className="relative z-10 text-sm text-cream/35">
          Academic materials, within reach.
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 sm:py-12 lg:px-12 xl:px-20">
        {/* Mobile atmosphere */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link
              to="/"
              className="font-display text-xl font-bold text-ink"
            >
              FUTMx<span className="text-coral">Store</span>
            </Link>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-cream">
              <BookOpen size={18} />
            </div>
          </div>

          <Link
            to="/"
            className="mb-10 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-ink/55 transition hover:text-ink"
          >
            <ArrowLeft size={16} />
            Back to library
          </Link>

          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-coral">
              <BookOpen size={13} />
              Your study shelf
            </div>

            <h1 className="font-display text-4xl leading-tight sm:text-5xl">
              {title}
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-ink/60 sm:text-base">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

function Feature({
  icon,
  label,
}: {
  icon: ReactNode
  label: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-white/60 backdrop-blur">
      <span className="text-gold">{icon}</span>
      {label}
    </div>
  )
}