import {
  ArrowLeft,
  Check,
  ChevronDown,
  FileUp,
  Search,
  UploadCloud,
  X,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef, useState } from 'react'

import { academicService } from '../features/academics/services'
import { materialService } from '../features/materials/services'
import { getApiMessage } from '../api/client'
import type { AcademicSession, Course } from '../types/api'

const schema = z.object({
  course: z.coerce.number().positive('Choose a course.'),

  academic_session: z.coerce
    .number()
    .positive('Choose an academic session.'),

  title: z.string().min(2, 'Add a title.'),

  description: z.string(),

  file: z
    .custom<FileList>()
    .refine(
      (files) => files?.length === 1,
      'Choose a file.',
    ),
})

type FormInput = z.input<typeof schema>
type FormValues = z.output<typeof schema>

interface UploadNavigationState {
  selectedCourseId?: number
  courseCreated?: boolean
}

export function UploadMaterial() {
  const [courses, setCourses] = useState<Course[]>([])
  const [academicSessions, setAcademicSessions] = useState<
    AcademicSession[]
  >([])

  const [courseSearch, setCourseSearch] = useState('')
  const [courseDropdownOpen, setCourseDropdownOpen] =
    useState(false)

  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null)

  const [error, setError] = useState('')
  const [courseCreatedMessage, setCourseCreatedMessage] =
    useState(false)

  const coursePickerRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()
  const location = useLocation()

  const navigationState =
    (location.state as UploadNavigationState | null) ?? null

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
      academic_session: undefined,
    },
  })

  const selectedFile = watch('file')?.[0]

  /*
   * Load courses and academic sessions.
   */
  useEffect(() => {
    void Promise.all([
      academicService.courses(),
      academicService.academicSessions(),
    ])
      .then(([courseData, sessionData]) => {
        setCourses(courseData)
        setAcademicSessions(sessionData)
      })
      .catch((e: unknown) =>
        setError(
          getApiMessage(
            e,
            'Academic information could not be loaded.',
          ),
        ),
      )
  }, [])

  /*
   * If a new course was just created, automatically select it.
   */
  useEffect(() => {
    const selectedCourseId =
      navigationState?.selectedCourseId

    if (!selectedCourseId || courses.length === 0) {
      return
    }

    const createdCourse = courses.find(
      (course) => course.id === selectedCourseId,
    )

    if (!createdCourse) {
      return
    }

    setSelectedCourse(createdCourse)

    setValue('course', createdCourse.id, {
      shouldValidate: true,
      shouldDirty: true,
    })

    if (navigationState?.courseCreated) {
      setCourseCreatedMessage(true)

      const timer = window.setTimeout(() => {
        setCourseCreatedMessage(false)
      }, 3500)

      return () => window.clearTimeout(timer)
    }

    /*
     * Remove navigation state after consuming it so a refresh/back
     * navigation does not repeatedly re-apply the same course.
     */
    navigate(location.pathname, {
      replace: true,
      state: null,
    })
  }, [
    courses,
    location.pathname,
    navigationState?.courseCreated,
    navigationState?.selectedCourseId,
    navigate,
    setValue,
  ])

  /*
   * Close the course dropdown when the user clicks outside it.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        coursePickerRef.current &&
        !coursePickerRef.current.contains(
          event.target as Node,
        )
      ) {
        setCourseDropdownOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  /*
   * Search courses by code or title.
   */
  const filteredCourses = useMemo(() => {
    const query = courseSearch.trim().toLowerCase()

    if (!query) {
      return courses.slice(0, 50)
    }

    return courses
      .filter((course) => {
        const code = course.code.toLowerCase()
        const title = course.title.toLowerCase()

        return (
          code.includes(query) ||
          title.includes(query)
        )
      })
      .slice(0, 50)
  }, [courses, courseSearch])

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)

    setValue('course', course.id, {
      shouldValidate: true,
      shouldDirty: true,
    })

    setCourseSearch('')
    setCourseDropdownOpen(false)
    setError('')
  }

  const handleCourseClear = () => {
    setSelectedCourse(null)

    setValue('course', 0, {
      shouldValidate: true,
      shouldDirty: true,
    })

    setCourseSearch('')
    setCourseDropdownOpen(false)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream px-3 py-5 sm:px-5 sm:py-10">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-ink/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-2xl">
        <Link
          to="/upload"
          className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-lg px-1 text-sm font-bold text-ink/55 transition-colors hover:text-ink sm:mb-10"
        >
          <ArrowLeft size={16} />
          Back to contribution
        </Link>

        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-soft">
          {/* Header */}
          <div className="relative overflow-hidden px-5 pb-7 pt-7 sm:px-10 sm:pb-9 sm:pt-10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-coral/5" />

            <div className="relative flex items-start justify-between gap-5">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-coral">
                  <UploadCloud size={13} />
                  Share knowledge
                </div>

                <h1 className="font-display text-4xl leading-tight sm:text-5xl">
                  Upload material.
                </h1>

                <p className="mt-3 max-w-lg text-sm leading-6 text-ink/55">
                  Put useful academic resources where other students can
                  actually find them.
                </p>
              </div>

              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral/10 text-coral sm:flex">
                <UploadCloud size={27} strokeWidth={1.8} />
              </div>
            </div>
          </div>

          {/* Course-created confirmation */}
          {courseCreatedMessage && (
            <div
              role="status"
              className="mx-4 mb-2 flex items-start gap-3 rounded-2xl border border-green-600/10 bg-green-500/10 px-4 py-3.5 sm:mx-7"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                <Check size={16} />
              </div>

              <div>
                <p className="text-sm font-bold text-green-800">
                  Course added successfully
                </p>

                <p className="mt-0.5 text-xs leading-5 text-green-800/70">
                  We've selected it for you. Just finish your upload.
                </p>
              </div>
            </div>
          )}

          <form
            className="space-y-6 px-5 pb-6 sm:space-y-7 sm:px-10 sm:pb-10"
            onSubmit={handleSubmit(async (values) => {
              try {
                setError('')

                await materialService.upload({
                  course: values.course,
                  academic_session:
                    values.academic_session,
                  title: values.title,
                  description: values.description,
                  file: values.file[0],
                })

                navigate('/')
              } catch (e) {
                setError(
                  getApiMessage(
                    e,
                    'Upload failed. Please try again.',
                  ),
                )
              }
            })}
          >
            {/* COURSE */}
            <div className="block text-sm font-semibold">
              <div className="flex items-center justify-between gap-3">
                <span>Course</span>

                {!selectedCourse && (
                  <span className="text-[11px] font-normal text-ink/40">
                    Required
                  </span>
                )}
              </div>

              <div
                ref={coursePickerRef}
                className="relative mt-2"
              >
                {selectedCourse ? (
                  <div className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-coral/30 bg-coral/5 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral text-white">
                        <Check size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">
                          {selectedCourse.code} ·{' '}
                          {selectedCourse.title}
                        </p>

                        <p className="mt-0.5 truncate text-xs font-normal text-ink/50">
                          {selectedCourse.semester_name}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCourseClear}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink/40 transition hover:bg-ink/5 hover:text-ink"
                      aria-label="Change course"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35"
                    />

                    <input
                      type="text"
                      value={courseSearch}
                      onChange={(event) => {
                        setCourseSearch(event.target.value)
                        setCourseDropdownOpen(true)
                      }}
                      onFocus={() =>
                        setCourseDropdownOpen(true)
                      }
                      placeholder="Search course code or title..."
                      className="block min-h-14 w-full rounded-2xl border border-ink/15 bg-cream px-11 pr-10 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                      autoComplete="off"
                    />

                    <ChevronDown
                      size={18}
                      className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/35 transition ${
                        courseDropdownOpen
                          ? 'rotate-180'
                          : ''
                      }`}
                    />

                    {courseDropdownOpen && (
                      <div className="absolute z-30 mt-2 max-h-[55vh] w-full overflow-y-auto overscroll-contain rounded-2xl border border-ink/10 bg-paper shadow-xl">
                        {filteredCourses.length > 0 ? (
                          <>
                            {filteredCourses.map(
                              (course) => (
                                <button
                                  key={course.id}
                                  type="button"
                                  onClick={() =>
                                    handleCourseSelect(
                                      course,
                                    )
                                  }
                                  className="flex min-h-20 w-full items-start gap-3 border-b border-ink/5 px-4 py-4 text-left transition last:border-b-0 hover:bg-cream active:bg-cream"
                                >
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-coral/10 text-coral">
                                    <FileUp size={16} />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="font-bold text-ink">
                                      {course.code}
                                    </p>

                                    <p className="mt-0.5 truncate text-sm font-normal text-ink/60">
                                      {course.title}
                                    </p>

                                    <p className="mt-1 text-xs font-normal text-ink/40">
                                      {course.semester_name}
                                    </p>
                                  </div>
                                </button>
                              ),
                            )}

                            {courseSearch.trim() && (
                              <p className="border-t border-ink/5 px-4 py-3 text-xs text-ink/40">
                                Showing up to 50 matching courses.
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="px-5 py-7 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/10 text-coral">
                              <Search size={21} />
                            </div>

                            <p className="mt-4 font-bold text-ink">
                              No course found
                            </p>

                            <p className="mx-auto mt-1 max-w-xs text-sm leading-5 text-ink/50">
                              We couldn't find a course matching
                              "{courseSearch}".
                            </p>

                            <Link
                              to="/upload/course"
                              state={{
                                returnTo: '/upload/material',
                                searchedCourse: courseSearch,
                              }}
                              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-coral px-5 text-sm font-bold text-white transition hover:opacity-90"
                              onClick={() =>
                                setCourseDropdownOpen(
                                  false,
                                )
                              }
                            >
                              + Add this course
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {errors.course && (
                <span className="mt-1.5 block text-xs font-normal text-coral">
                  {errors.course.message}
                </span>
              )}

              {!selectedCourse && !courseSearch && (
                <p className="mt-2 text-xs leading-5 font-normal text-ink/50">
                  Can't find your course?{' '}
                  <Link
                    to="/upload/course"
                    state={{
                      returnTo: '/upload/material',
                    }}
                    className="font-bold text-coral hover:text-ink"
                  >
                    Add it here
                  </Link>
                </p>
              )}
            </div>

            {/* SESSION */}
            <label className="block text-sm font-semibold">
              <span>Academic session</span>

              <select
                {...register('academic_session')}
                defaultValue=""
                className="mt-2 block min-h-14 w-full rounded-2xl border border-ink/15 bg-cream px-4 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
              >
                <option value="" disabled>
                  Select academic session
                </option>

                {academicSessions.map((session) => (
                  <option
                    key={session.id}
                    value={session.id}
                  >
                    {session.name}
                    {session.is_active
                      ? ' · Current session'
                      : ''}
                  </option>
                ))}
              </select>

              {errors.academic_session && (
                <span className="mt-1.5 block text-xs font-normal text-coral">
                  {errors.academic_session.message}
                </span>
              )}
            </label>

            {/* TITLE */}
            <label className="block text-sm font-semibold">
              <span>Material title</span>

              <input
                {...register('title')}
                className="mt-2 block min-h-14 w-full rounded-2xl border border-ink/15 bg-cream px-4 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                placeholder="e.g. Week 4 lecture notes"
              />

              {errors.title && (
                <span className="mt-1.5 block text-xs font-normal text-coral">
                  {errors.title.message}
                </span>
              )}
            </label>

            {/* DESCRIPTION */}
            <label className="block text-sm font-semibold">
              <span>
                Description{' '}
                <span className="font-normal text-ink/35">
                  · optional
                </span>
              </span>

              <textarea
                {...register('description')}
                rows={4}
                className="mt-2 block min-h-28 w-full resize-y rounded-2xl border border-ink/15 bg-cream px-4 py-3 text-sm leading-6 outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                placeholder="Tell other students what they will find in this material..."
              />
            </label>

            {/* FILE */}
            <div className="block text-sm font-semibold">
              <span>File</span>

              <label className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink/15 bg-cream px-4 py-6 text-center transition hover:border-coral/40 hover:bg-coral/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-coral/10 text-coral">
                  <UploadCloud size={22} />
                </div>

                <p className="mt-3 text-sm font-bold text-ink">
                  {selectedFile
                    ? selectedFile.name
                    : 'Choose your academic file'}
                </p>

                <p className="mt-1 text-xs font-normal text-ink/45">
                  {selectedFile
                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                    : 'Tap here to browse files on your phone'}
                </p>

                <input
                  type="file"
                  {...register('file')}
                  className="sr-only"
                />
              </label>

              {errors.file && (
                <span className="mt-1.5 block text-xs font-normal text-coral">
                  {String(errors.file.message)}
                </span>
              )}
            </div>

            {/* ERROR */}
            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-coral/10 bg-coral/10 px-4 py-3.5 text-sm leading-5 text-coral"
              >
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-14 w-full rounded-2xl bg-coral px-5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-ink active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Uploading your material...'
                : 'Upload material'}
            </button>

            <p className="text-center text-xs leading-5 text-ink/40">
              Your contribution helps another student find what they need.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}