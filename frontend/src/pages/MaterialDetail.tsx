import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileArchive,
  FileText,
  GraduationCap,
  HardDriveDownload,
  Layers3,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { AppShell } from '../components/AppShell'
import { getApiMessage } from '../api/client'
import { materialService } from '../features/materials/services'
import { useAuthStore } from '../store/auth'
import type { Material } from '../types/api'


function formatFileSize(bytes: number | null) {
  if (!bytes || bytes <= 0) return 'Unknown size'

  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, index)

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}


function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}


function formatTimeAgo(date: string) {
  const now = Date.now()
  const created = new Date(date).getTime()
  const difference = Math.max(0, now - created)

  const minutes = Math.floor(difference / 60000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)

  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)

  if (days < 30) return `${days}d ago`

  const months = Math.floor(days / 30)

  if (months < 12) return `${months}mo ago`

  const years = Math.floor(months / 12)

  return `${years}y ago`
}


export function MaterialDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const user = useAuthStore((s) => s.user)

  const [material, setMaterial] = useState<Material | null>(null)
  const [error, setError] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  useEffect(() => {
    if (!id) {
      setError('This material could not be found.')
      return
    }

    setError('')
    setMaterial(null)

    void materialService
      .detail(Number(id))
      .then(setMaterial)
      .catch((e: unknown) =>
        setError(
          getApiMessage(
            e,
            'This material could not be found.',
          ),
        ),
      )
  }, [id])

  const academicPath = useMemo(() => {
    if (!material) return []

    return [
      material.faculty_name,
      material.department_name,
      material.programme_name,
      material.level_name,
      material.semester_name,
    ].filter(Boolean)
  }, [material])

  const handleDownload = async () => {
    if (!material) return

    if (!user) {
      navigate('/login')
      return
    }

    setIsDownloading(true)
    setDownloadError('')

    try {
      const blob = await materialService.download(material.id)

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download =
        material.file_name ||
        `${material.title}.${material.file_extension?.toLowerCase() || 'file'}`

      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(url)
    } catch (e: unknown) {
      setDownloadError(
        getApiMessage(
          e,
          'We could not download this file. Please try again.',
        ),
      )
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <AppShell>
      <main className="min-h-screen bg-cream">
        {error ? (
          <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
            <div className="rounded-[2rem] border border-coral/20 bg-paper p-8 text-center shadow-soft sm:p-12">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-coral/10 text-coral">
                <FileText size={28} />
              </div>

              <h1 className="mt-6 font-display text-3xl text-ink sm:text-4xl">
                Resource unavailable
              </h1>

              <p className="mx-auto mt-4 max-w-md leading-7 text-ink/60">
                {error}
              </p>

              <Link
                to="/"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-6 font-bold text-white transition hover:-translate-y-0.5 hover:bg-coral"
              >
                <ArrowLeft size={17} />
                Back to library
              </Link>
            </div>
          </section>
        ) : !material ? (
          <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
            <div className="h-[32rem] animate-pulse rounded-[2rem] bg-ink/10" />
          </section>
        ) : (
          <>
            {/* Atmospheric hero */}
            <section className="relative overflow-hidden bg-ink text-white">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -left-24 -top-32 h-80 w-80 rounded-full bg-coral blur-3xl" />
                <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-gold blur-3xl" />
              </div>

              <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:44px_44px]" />

              <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pb-20 lg:pb-24 lg:pt-12">
                <Link
                  to="/"
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/70 backdrop-blur transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft
                    size={16}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                  Back to library
                </Link>

                <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-coral px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white">
                        <BookOpen size={13} />
                        {material.course_code}
                      </span>

                      {material.course_offering_session && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80 backdrop-blur">
                          <CalendarDays size={13} />
                          {material.course_offering_session}
                        </span>
                      )}
                    </div>

                    <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
                      Academic resource
                    </p>

                    <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                      {material.title}
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                      {material.description ||
                        'A shared academic resource available through the FUTMxStore library.'}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-coral px-5 font-bold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isDownloading ? (
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                        ) : (
                          <Download
                            size={18}
                            className="transition-transform group-hover:translate-y-0.5"
                          />
                        )}

                        {isDownloading
                          ? 'Preparing download...'
                          : 'Download resource'}
                      </button>

                      <span className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/60 backdrop-blur">
                        <Clock3 size={16} />
                        Added {formatTimeAgo(material.created_at)}
                      </span>
                    </div>

                    {downloadError && (
                      <p className="mt-4 text-sm font-semibold text-coral-200">
                        {downloadError}
                      </p>
                    )}
                  </div>

                  {/* Document visual */}
                  <div className="relative mx-auto w-full max-w-sm lg:ml-auto">
                    <div className="absolute -inset-6 rounded-[3rem] bg-white/[0.04] blur-2xl" />

                    <div className="relative rotate-[-2deg] rounded-[2rem] border border-white/10 bg-white/[0.07] p-3 shadow-2xl backdrop-blur transition duration-500 hover:rotate-0">
                      <div className="rounded-[1.5rem] bg-paper p-6 text-ink sm:p-8">
                        <div className="flex items-start justify-between">
                          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-coral/10 text-coral">
                            {material.file_extension === 'PDF' ? (
                              <FileText size={27} />
                            ) : (
                              <FileArchive size={27} />
                            )}
                          </div>

                          {material.file_extension && (
                            <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-black tracking-wider text-ink/55">
                              {material.file_extension}
                            </span>
                          )}
                        </div>

                        <div className="mt-12">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">
                            {material.course_code}
                          </p>

                          <h2 className="mt-2 line-clamp-3 font-display text-2xl leading-tight">
                            {material.title}
                          </h2>
                        </div>

                        <div className="mt-10 space-y-3 border-t border-ink/10 pt-5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-ink/45">Format</span>
                            <span className="font-bold">
                              {material.file_extension || 'File'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-ink/45">Size</span>
                            <span className="font-bold">
                              {formatFileSize(material.file_size)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -bottom-4 -left-5 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs font-bold text-white/80 shadow-xl backdrop-blur sm:flex">
                      <CheckCircle2
                        size={15}
                        className="text-gold"
                      />
                      Community resource
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Main information */}
            <section className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-16">
              <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                {/* Academic context */}
                <div className="rounded-[2rem] border border-ink/10 bg-paper p-6 shadow-soft sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">
                        Where this belongs
                      </p>

                      <h2 className="mt-2 font-display text-2xl sm:text-3xl">
                        Academic context
                      </h2>
                    </div>

                    <div className="hidden h-11 w-11 place-items-center rounded-xl bg-gold/10 text-gold sm:grid">
                      <GraduationCap size={21} />
                    </div>
                  </div>

                  <div className="mt-8">
                    {academicPath.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {academicPath.map((item, index) => (
                          <div
                            key={`${item}-${index}`}
                            className="flex items-center gap-2"
                          >
                            <span className="rounded-xl border border-ink/10 bg-cream px-3 py-2 text-sm font-semibold text-ink/70">
                              {item}
                            </span>

                            {index < academicPath.length - 1 && (
                              <span className="text-ink/20">/</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-ink/50">
                        Academic context is not available for this resource.
                      </p>
                    )}
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-cream p-4">
                      <div className="flex items-center gap-2 text-ink/45">
                        <BookOpen size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Course
                        </span>
                      </div>

                      <p className="mt-2 font-bold text-ink">
                        {material.course_code}
                      </p>

                      <p className="mt-1 text-sm text-ink/55">
                        {material.course_title}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-cream p-4">
                      <div className="flex items-center gap-2 text-ink/45">
                        <Layers3 size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Course unit
                        </span>
                      </div>

                      <p className="mt-2 font-bold text-ink">
                        {material.course_unit}{' '}
                        {material.course_unit === 1 ? 'unit' : 'units'}
                      </p>

                      <p className="mt-1 text-sm text-ink/55">
                        {material.semester_name || 'Semester not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resource information */}
                <aside className="rounded-[2rem] border border-ink/10 bg-paper p-6 shadow-soft sm:p-8">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">
                    Resource details
                  </p>

                  <h2 className="mt-2 font-display text-2xl">
                    At a glance
                  </h2>

                  <div className="mt-7 divide-y divide-ink/10">
                    <div className="flex items-start gap-3 py-4 first:pt-0">
                      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-coral/10 text-coral">
                        <FileText size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-ink/40">
                          File
                        </p>

                        <p className="mt-1 truncate text-sm font-bold text-ink">
                          {material.file_name || material.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 py-4">
                      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                        <HardDriveDownload size={17} />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-ink/40">
                          Size
                        </p>

                        <p className="mt-1 text-sm font-bold text-ink">
                          {formatFileSize(material.file_size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 py-4">
                      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-moss/10 text-moss">
                        <CalendarDays size={17} />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-ink/40">
                          Added
                        </p>

                        <p className="mt-1 text-sm font-bold text-ink">
                          {formatDate(material.created_at)}
                        </p>
                      </div>
                    </div>

                    {material.uploaded_by_username && (
                      <div className="flex items-start gap-3 py-4 last:pb-0">
                        <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink/5 text-ink/60">
                          <Sparkles size={17} />
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-ink/40">
                            Contributed by
                          </p>

                          <p className="mt-1 text-sm font-bold text-ink">
                            @{material.uploaded_by_username}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </aside>
              </div>

              {/* Bottom contribution CTA */}
              <div className="relative mt-6 overflow-hidden rounded-[2rem] bg-ink p-6 text-white shadow-soft sm:p-8 lg:p-10">
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-coral/20 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">
                      Build the library
                    </p>

                    <h2 className="mt-2 font-display text-2xl sm:text-3xl">
                      Have useful material for other students?
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
                      Share academic resources and help make useful knowledge
                      easier for the FUTMinna community to find.
                    </p>
                  </div>

                  <Link
                    to="/upload"
                    className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 font-bold text-ink transition hover:-translate-y-0.5 hover:bg-coral hover:text-white"
                  >
                    Share a resource
                    <Download
                      size={17}
                      className="rotate-[-45deg]"
                    />
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </AppShell>
  )
}