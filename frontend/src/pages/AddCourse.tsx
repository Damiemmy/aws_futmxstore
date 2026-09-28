import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  GraduationCap,
  Plus,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { getApiMessage } from '../api/client'
import { academicService } from '../features/academics/services'
import type {
  Department,
  Faculty,
  Level,
  Programme,
  Semester,
} from '../types/api'

interface AddCourseNavigationState {
  returnTo?: string
  searchedCourse?: string
}

export function AddCourse() {
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])

  const [facultyId, setFacultyId] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [programmeId, setProgrammeId] = useState('')
  const [levelId, setLevelId] = useState('')
  const [semesterId, setSemesterId] = useState('')

  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [unit, setUnit] = useState('')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  const navigationState =
    (location.state as AddCourseNavigationState | null) ??
    null

  const returnTo =
    navigationState?.returnTo ?? '/upload/material'

  const searchedCourse =
    navigationState?.searchedCourse ?? ''

  useEffect(() => {
    void Promise.all([
      academicService.faculties(),
      academicService.departments(),
      academicService.programmes(),
      academicService.levels(),
      academicService.semesters(),
    ])
      .then(
        ([
          facultyData,
          departmentData,
          programmeData,
          levelData,
          semesterData,
        ]) => {
          setFaculties(facultyData)
          setDepartments(departmentData)
          setProgrammes(programmeData)
          setLevels(levelData)
          setSemesters(semesterData)
        },
      )
      .catch((e: unknown) => {
        setError(
          getApiMessage(
            e,
            'Academic information could not be loaded.',
          ),
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const departmentProgrammes = useMemo(() => {
    if (!departmentId) {
      return []
    }

    return programmes.filter(
      (programme) =>
        String(programme.department) === departmentId,
    )
  }, [departmentId, programmes])

  const departmentHasProgrammes =
    departmentProgrammes.length > 0

  const availableLevels = useMemo(() => {
    if (!departmentId) {
      return []
    }

    return levels.filter((level) => {
      if (String(level.department) !== departmentId) {
        return false
      }

      if (departmentHasProgrammes) {
        return (
          level.programme !== null &&
          String(level.programme) === programmeId
        )
      }

      return level.programme === null
    })
  }, [
    departmentId,
    departmentHasProgrammes,
    levels,
    programmeId,
  ])

  const availableSemesters = useMemo(() => {
    if (!levelId) {
      return []
    }

    return semesters.filter(
      (semester) => String(semester.level) === levelId,
    )
  }, [levelId, semesters])

  const handleFacultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFacultyId(event.target.value)
    setDepartmentId('')
    setProgrammeId('')
    setLevelId('')
    setSemesterId('')
  }

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDepartmentId(event.target.value)
    setProgrammeId('')
    setLevelId('')
    setSemesterId('')
  }

  const handleProgrammeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setProgrammeId(event.target.value)
    setLevelId('')
    setSemesterId('')
  }

  const handleLevelChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLevelId(event.target.value)
    setSemesterId('')
  }

  const resetForm = () => {
    setFacultyId('')
    setDepartmentId('')
    setProgrammeId('')
    setLevelId('')
    setSemesterId('')
    setCode('')
    setTitle('')
    setUnit('')
    setError('')
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setError('')

    if (!facultyId) {
      setError('Choose a faculty.')
      return
    }

    if (!departmentId) {
      setError('Choose a department.')
      return
    }

    if (departmentHasProgrammes && !programmeId) {
      setError('Choose a programme.')
      return
    }

    if (!levelId) {
      setError('Choose a level.')
      return
    }

    if (!semesterId) {
      setError('Choose a semester.')
      return
    }

    if (!code.trim()) {
      setError('Enter the course code.')
      return
    }

    if (!title.trim()) {
      setError('Enter the course title.')
      return
    }

    const unitValue = Number(unit)

    if (
      !unit ||
      !Number.isInteger(unitValue) ||
      unitValue <= 0
    ) {
      setError('Enter a valid course unit.')
      return
    }

    try {
      setSubmitting(true)

      /*
       * The backend returns the newly created Course.
       * We use its ID to automatically select it on
       * the upload material screen.
       */
      const createdCourse =
        await academicService.createCourse({
          code: code.trim(),
          title: title.trim(),
          unit: unitValue,
          semester: Number(semesterId),
        })

      /*
       * Clear the form immediately.
       *
       * The page will unmount on navigation, but explicitly
       * resetting keeps this component clean and prevents
       * stale form data if navigation behavior changes later.
       */
      resetForm()

      /*
       * Return the student to the task that brought them here.
       *
       * The UploadMaterial page receives the new course ID
       * and automatically selects the course.
       */
      navigate(returnTo, {
        replace: true,
        state: {
          selectedCourseId: createdCourse.id,
          courseCreated: true,
        },
      })
    } catch (e: unknown) {
      setError(
        getApiMessage(
          e,
          'The course could not be added. Please try again.',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream px-3 py-5 sm:px-5 sm:py-10">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-ink/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-2xl">
        {/* Back */}
        <Link
          to={returnTo}
          className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-lg px-1 text-sm font-bold text-ink/55 transition-colors hover:text-ink sm:mb-10"
        >
          <ArrowLeft size={16} />
          Back to upload
        </Link>

        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-soft">
          {/* Header */}
          <div className="relative overflow-hidden px-5 pb-7 pt-7 sm:px-10 sm:pb-9 sm:pt-10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-coral/5" />

            <div className="relative flex items-start justify-between gap-5">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-coral">
                  <Plus size={13} />
                  Expand the library
                </div>

                <h1 className="font-display text-4xl leading-tight sm:text-5xl">
                  Add a course.
                </h1>

                <p className="mt-3 max-w-lg text-sm leading-6 text-ink/55">
                  Add the missing course once. We'll take you straight back
                  to your upload when you're done.
                </p>
              </div>

              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral/10 text-coral sm:flex">
                <BookOpen size={27} strokeWidth={1.8} />
              </div>
            </div>

            {/* Context from course search */}
            {searchedCourse && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-coral/10 bg-coral/5 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral text-white">
                  <SearchIcon />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-coral">
                    You were looking for
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-ink">
                    {searchedCourse}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="px-5 pb-6 sm:px-10 sm:pb-10">
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-2xl border border-coral/10 bg-coral/10 px-4 py-3.5 text-sm font-semibold leading-5 text-coral"
              >
                <div className="mt-0.5 shrink-0">
                  <Plus size={16} />
                </div>

                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                <div className="h-14 animate-pulse rounded-2xl bg-cream" />
                <div className="h-14 animate-pulse rounded-2xl bg-cream" />
                <div className="h-14 animate-pulse rounded-2xl bg-cream" />
                <div className="h-14 animate-pulse rounded-2xl bg-cream" />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 sm:space-y-6"
              >
                {/* FACULTY */}
                <label className="block text-sm font-semibold">
                  Faculty

                  <select
                    value={facultyId}
                    onChange={handleFacultyChange}
                    className="mt-2 block min-h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-cream px-4 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                  >
                    <option value="">
                      Select faculty
                    </option>

                    {faculties.map((faculty) => (
                      <option
                        key={faculty.id}
                        value={faculty.id}
                      >
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* DEPARTMENT */}
                <label className="block text-sm font-semibold">
                  Department

                  <select
                    value={departmentId}
                    onChange={handleDepartmentChange}
                    disabled={!facultyId}
                    className="mt-2 block min-h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-cream px-4 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {facultyId
                        ? 'Select department'
                        : 'Select a faculty first'}
                    </option>

                    {departments
                      .filter(
                        (department) =>
                          String(department.faculty) ===
                          facultyId,
                      )
                      .map((department) => (
                        <option
                          key={department.id}
                          value={department.id}
                        >
                          {department.name}
                        </option>
                      ))}
                  </select>
                </label>

                {/* PROGRAMME */}
                {departmentHasProgrammes && (
                  <label className="block text-sm font-semibold">
                    Programme

                    <select
                      value={programmeId}
                      onChange={handleProgrammeChange}
                      disabled={!departmentId}
                      className="mt-2 block min-h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-cream px-4 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">
                        Select programme
                      </option>

                      {departmentProgrammes.map(
                        (programme) => (
                          <option
                            key={programme.id}
                            value={programme.id}
                          >
                            {programme.name}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                )}

                {/* LEVEL */}
                <label className="block text-sm font-semibold">
                  Level

                  <select
                    value={levelId}
                    onChange={handleLevelChange}
                    disabled={
                      !departmentId ||
                      (departmentHasProgrammes &&
                        !programmeId)
                    }
                    className="mt-2 block min-h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-cream px-4 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {!departmentId
                        ? 'Select a department first'
                        : departmentHasProgrammes &&
                            !programmeId
                          ? 'Select a programme first'
                          : 'Select level'}
                    </option>

                    {availableLevels.map((level) => (
                      <option
                        key={level.id}
                        value={level.id}
                      >
                        {level.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* SEMESTER */}
                <label className="block text-sm font-semibold">
                  Semester

                  <select
                    value={semesterId}
                    onChange={(event) =>
                      setSemesterId(event.target.value)
                    }
                    disabled={!levelId}
                    className="mt-2 block min-h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-cream px-4 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {levelId
                        ? 'Select semester'
                        : 'Select a level first'}
                    </option>

                    {availableSemesters.map(
                      (semester) => (
                        <option
                          key={semester.id}
                          value={semester.id}
                        >
                          {semester.name}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                {/* COURSE DETAILS */}
                <div className="rounded-2xl border border-ink/10 bg-cream/60 p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-paper text-coral shadow-sm">
                      <BookOpen size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-ink">
                        Course details
                      </p>

                      <p className="text-xs text-ink/45">
                        Tell students exactly what this course is.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* CODE + UNIT */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_130px]">
                      <label className="block min-w-0 text-sm font-semibold">
                        Course code

                        <input
                          type="text"
                          value={code}
                          onChange={(event) =>
                            setCode(event.target.value)
                          }
                          placeholder="e.g. ITE 401"
                          autoCapitalize="characters"
                          autoComplete="off"
                          className="mt-2 block min-h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-paper px-4 text-sm uppercase outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                        />
                      </label>

                      <label className="block min-w-0 text-sm font-semibold">
                        Units

                        <input
                          type="number"
                          min="1"
                          max="10"
                          inputMode="numeric"
                          value={unit}
                          onChange={(event) =>
                            setUnit(event.target.value)
                          }
                          placeholder="e.g. 3"
                          className="mt-2 block min-h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-paper px-4 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                        />
                      </label>
                    </div>

                    {/* TITLE */}
                    <label className="block text-sm font-semibold">
                      Course title

                      <input
                        type="text"
                        value={title}
                        onChange={(event) =>
                          setTitle(event.target.value)
                        }
                        placeholder="e.g. Automotive Technology"
                        autoCapitalize="words"
                        autoComplete="off"
                        className="mt-2 block min-h-14 w-full min-w-0 rounded-2xl border border-ink/15 bg-paper px-4 text-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
                      />
                    </label>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-coral px-5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-ink active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Adding course...
                    </>
                  ) : (
                    <>
                      Add course & continue
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

                <div className="flex items-start gap-3 rounded-2xl bg-coral/5 p-4">
                  <Check
                    size={17}
                    className="mt-0.5 shrink-0 text-coral"
                  />

                  <p className="text-xs leading-5 text-ink/50">
                    Once added, we'll automatically select this course on
                    the upload page so you don't have to search for it
                    again.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/*
 * Small local icon component keeps the header clean without
 * introducing another dependency.
 */
function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}