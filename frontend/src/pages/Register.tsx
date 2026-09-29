import * as React from 'react'
import type { ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Sparkles,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import {
  api,
  parseApiError,
} from '../api/client'
import { login } from '../features/authentication/services'
import { useAuthStore } from '../store/auth'

const schema = z
  .object({
    email: z
    .string()
    .trim()
    .refine(
      (value) => value === value.toLowerCase(),
      'Use lowercase letters in your email address.',
    )
    .email('Enter a valid email address.'),
    username: z.string().min(2, 'Use at least 2 characters.'),
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match.',
  })

type FormValues = z.infer<typeof schema>

export function Register() {
  const navigate = useNavigate()
  const setSession = useAuthStore.setState
  const [error, setError] = React.useState('')

  const {
    register,
    handleSubmit,
    watch,
    setError: setFieldError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const password = watch('password', '')

  const passwordChecks = {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
  }

  return (
    <AuthFrame
      title="Make room to learn."
      subtitle="Create your place in the FUTMxStore community."
      sideTitle={
        <>
          Your academic
          <br />
          journey starts here.
        </>
      }
      sideLabel="Join the shelf"
      sideDescription="Find resources, discover useful materials, and help other students find what they need."
    >
      <form
        onSubmit={handleSubmit(async (values) => {
          setError('')

          try {
            await api.post(
              '/authentication/register/',
              values,
            )

            const session = await login({
              email: values.email,
              password: values.password,
            })

            setSession({ ...session })

            navigate('/')
          } catch (e) {
            const parsedError = parseApiError(
              e,
              'We could not create your account. Please review your details.',
            )

            /*
             * Clear any previous general error.
             */
            setError('')

            /*
             * Push backend validation errors into the
             * appropriate form fields.
             *
             * Example backend response:
             *
             * {
             *   username: [
             *     "user with this username already exists."
             *   ]
             * }
             *
             * becomes:
             *
             * errors.username
             */
            for (const [field, messages] of Object.entries(
              parsedError.fieldErrors,
            )) {
              if (
                field === 'email' ||
                field === 'username' ||
                field === 'password' ||
                field === 'confirm_password'
              ) {
                setFieldError(field, {
                  type: 'server',
                  message: messages.join(' '),
                })
              }
            }

            /*
             * If there are no field-specific errors,
             * show the general error message.
             */
            if (
              Object.keys(parsedError.fieldErrors).length === 0
            ) {
              setError(parsedError.message)
            }
          }
        })}
        className="space-y-5"
      >
        <Field
          label="Email"
          hint="Use an email you can access."
          error={errors.email?.message}
        >
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </Field>

        <Field
          label="Username"
          hint="This is how you will appear in the library."
          error={errors.username?.message}
        >
          <input
            autoComplete="username"
            placeholder="Choose a username"
            aria-invalid={Boolean(errors.username)}
            {...register('username')}
          />
        </Field>

        <Field
          label="Password"
          error={errors.password?.message}
        >
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />

          {password.length > 0 && (
            <div className="mt-3 grid gap-2 rounded-xl bg-cream p-3 sm:grid-cols-3">
              <PasswordCheck
                active={passwordChecks.length}
                label="8+ characters"
              />

              <PasswordCheck
                active={passwordChecks.hasLetter}
                label="A letter"
              />

              <PasswordCheck
                active={passwordChecks.hasNumber}
                label="A number"
              />
            </div>
          )}
        </Field>

        <Field
          label="Confirm password"
          error={errors.confirm_password?.message}
        >
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password again"
            aria-invalid={Boolean(errors.confirm_password)}
            {...register('confirm_password')}
          />
        </Field>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-coral/10 bg-coral/10 p-4 text-sm leading-6 text-coral"
          >
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-coral/10">
              !
            </span>

            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-coral px-5 font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            'Creating your account...'
          ) : (
            <>
              Create account

              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </form>

      <div className="mt-7 border-t border-ink/10 pt-6 text-center">
        <p className="text-sm text-ink/60">
          Already registered?{' '}
          <Link
            className="font-bold text-coral transition hover:text-ink"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthFrame>
  )
}

function PasswordCheck({
  active,
  label,
}: {
  active: boolean
  label: string
}) {
  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-semibold transition ${
        active
          ? 'text-moss'
          : 'text-ink/35'
      }`}
    >
      <span
        className={`grid h-4 w-4 place-items-center rounded-full transition ${
          active
            ? 'bg-moss text-white'
            : 'border border-ink/15 bg-paper'
        }`}
      >
        {active && (
          <Check
            size={10}
            strokeWidth={3}
          />
        )}
      </span>

      {label}
    </div>
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

      <span
        className={`mt-2 block [&>input]:min-h-12 [&>input]:w-full [&>input]:rounded-xl [&>input]:border [&>input]:bg-cream [&>input]:px-4 [&>input]:text-sm [&>input]:text-ink [&>input]:outline-none [&>input]:transition [&>input]:placeholder:text-ink/30 [&>input]:focus:ring-4 ${
          error
            ? '[&>input]:border-coral [&>input]:focus:border-coral [&>input]:focus:ring-coral/10'
            : '[&>input]:border-ink/15 [&>input]:focus:border-coral [&>input]:focus:ring-coral/10'
        }`}
      >
        {children}
      </span>

      {error && (
        <span
          role="alert"
          className="mt-1.5 block text-xs font-medium leading-5 text-coral"
        >
          {error}
        </span>
      )}
    </label>
  )
}

function AuthFrame({
  title,
  subtitle,
  sideTitle,
  sideLabel,
  sideDescription,
  children,
}: {
  title: string
  subtitle: string
  sideTitle: ReactNode
  sideLabel: string
  sideDescription: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      {/* Desktop brand panel */}
      <div className="relative hidden overflow-hidden bg-ink p-12 text-cream lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-coral/20 blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:48px_48px]" />
        </div>

        <Link
          to="/"
          className="relative z-10 inline-flex w-fit font-display text-xl font-bold transition hover:text-white"
        >
          FUTMx<span className="text-coral">Store</span>
        </Link>

        <div className="relative z-10 max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-gold backdrop-blur">
            <Sparkles size={14} />
            {sideLabel}
          </div>

          <p className="font-display text-6xl leading-[0.95] xl:text-7xl">
            {sideTitle}
          </p>

          <p className="mt-7 max-w-md text-base leading-7 text-cream/50">
            {sideDescription}
          </p>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
            <Feature
              icon={<BookOpen size={17} />}
              text="Discover"
            />

            <Feature
              icon={<Sparkles size={17} />}
              text="Learn"
            />

            <Feature
              icon={<ArrowRight size={17} />}
              text="Share"
            />
          </div>
        </div>

        <p className="relative z-10 text-sm text-cream/35">
          Academic materials, within reach.
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 sm:py-12 lg:px-12 xl:px-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
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
              <Sparkles size={13} />
              New account
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
  text,
}: {
  icon: ReactNode
  text: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-white/60 backdrop-blur">
      <span className="text-gold">
        {icon}
      </span>

      {text}
    </div>
  )
}