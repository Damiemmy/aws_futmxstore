import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
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
  } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const from = (location.state as { from?: string } | null)?.from || '/'
  return (
    <AuthFrame title="Welcome back." subtitle="Your study shelf is waiting.">
      <form
        onSubmit={handleSubmit(async (values) => {
          try {
            await signIn(values)
            navigate(from, { replace: true })
          } catch (e) {
            setError(getApiMessage(e, 'We could not sign you in. Check your details.'))
          }
        })}
        className="space-y-5"
      >
        <Field label="Email" error={errors.email?.message}>
          <input type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <input type="password" autoComplete="current-password" {...register('password')} />
        </Field>
        {error && (
          <p role="alert" className="rounded-lg bg-coral/10 p-3 text-sm text-coral">
            {error}
          </p>
        )}
        <button
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-5 py-3.5 font-bold text-white transition hover:bg-ink disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'} <ArrowRight size={18} />
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-ink/60">
        New here?{' '}
        <Link className="font-bold text-coral" to="/register">
          Create an account
        </Link>
      </p>
    </AuthFrame>
  )
}
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <span className="mt-2 block [&>input]:w-full [&>input]:rounded-xl [&>input]:border [&>input]:border-ink/15 [&>input]:bg-cream [&>input]:px-4 [&>input]:py-3 [&>input]:outline-none [&>input]:focus:border-coral">
        {children}
      </span>
      {error && <span className="mt-1 block text-xs font-normal text-coral">{error}</span>}
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
    <div className="grid min-h-screen bg-cream lg:grid-cols-[.9fr_1.1fr]">
      <div className="hidden bg-ink p-12 text-cream lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="font-display text-xl font-bold">
          FUTMx<span className="text-coral">Store</span>
        </Link>
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[.18em] text-gold">
            Keep learning
          </p>
          <p className="font-display text-6xl leading-none">
            A better shelf
            <br />
            for every semester.
          </p>
        </div>
        <p className="text-sm text-cream/50">Academic materials, within reach.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-12 inline-flex items-center gap-2 text-sm font-bold text-ink/55 hover:text-ink"
          >
            <ArrowLeft size={16} /> Back to library
          </Link>
          <h1 className="font-display text-5xl">{title}</h1>
          <p className="mt-3 text-ink/60">{subtitle}</p>
          <div className="mt-9">{children}</div>
        </div>
      </div>
    </div>
  )
}
