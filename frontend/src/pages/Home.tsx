import {
  ArrowRight,
  BookOpen,
  FileText,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { AppShell } from '../components/AppShell'
import { MaterialCard } from '../components/MaterialCard'
import { academicService } from '../features/academics/services'
import { materialService } from '../features/materials/services'
import { getApiMessage } from '../api/client'

import type {
  Course,
  Department,
  Faculty,
  Level,
  Material,
  Semester,
} from '../types/api'

export function Home() {
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [materials, setMaterials] = useState<Material[]>([])

  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    void Promise.all([
      academicService.faculties(),
      academicService.departments(),
      academicService.levels(),
      academicService.semesters(),
      academicService.courses(),
    ])
      .then(([f, d, l, s, c]) => {
        setFaculties(f)
        setDepartments(d)
        setLevels(l)
        setSemesters(s)
        setCourses(c)
      })
      .catch((e: unknown) =>
        setError(
          getApiMessage(
            e,
            'Academic options could not be loaded.',
          ),
        ),
      )
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true)

      void materialService
        .list({
          course: selectedCourse
            ? Number(selectedCourse)
            : undefined,
          search: search || undefined,
          page,
        })
        .then((data) => {
          setMaterials(data.results)
          setCount(data.count)
          setError('')
        })
        .catch((e: unknown) =>
          setError(
            getApiMessage(
              e,
              'Materials could not be loaded.',
            ),
          ),
        )
        .finally(() => setLoading(false))
    }, 350)

    return () => window.clearTimeout(timer)
  }, [selectedCourse, search, page])

  const stats = useMemo(
    () => [
      {
        value: faculties.length,
        label: 'Faculties',
      },
      {
        value: departments.length,
        label: 'Departments',
      },
      {
        value: courses.length,
        label: 'Courses',
      },
    ],
    [
      faculties.length,
      departments.length,
      courses.length,
    ],
  )

  const visibleDepartments = selectedFaculty
    ? departments.filter(
        (item) =>
          item.faculty === Number(selectedFaculty),
      )
    : departments

  const visibleLevels = selectedDepartment
    ? levels.filter(
        (item) =>
          item.department === Number(selectedDepartment),
      )
    : levels

  const visibleSemesters = selectedLevel
    ? semesters.filter(
        (item) =>
          item.level === Number(selectedLevel),
      )
    : semesters

  const visibleCourses = selectedLevel
    ? courses.filter((item) =>
        visibleSemesters.some(
          (semester) => semester.id === item.semester,
        ),
      )
    : courses

  const hasActiveFilters =
    Boolean(selectedFaculty) ||
    Boolean(selectedDepartment) ||
    Boolean(selectedLevel) ||
    Boolean(selectedCourse) ||
    Boolean(search)

  const clearFilters = () => {
    setSelectedFaculty('')
    setSelectedDepartment('')
    setSelectedLevel('')
    setSelectedCourse('')
    setSearch('')
    setPage(1)
  }

  return (
    <AppShell>
      <main className="overflow-x-hidden pb-20">

        {/* =========================================================
            HERO
        ========================================================== */}

        <section className="mx-auto max-w-7xl px-3 pt-3 sm:px-5 sm:pt-6 lg:px-8 lg:pt-8">
          <div className="relative isolate min-h-[600px] overflow-hidden rounded-[2rem] bg-ink text-cream shadow-soft sm:min-h-[650px] sm:rounded-[2.75rem] lg:min-h-[700px]">

            {/* Background atmosphere */}
            <div className="absolute inset-0 overflow-hidden">

              {/* Large glow */}
              <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-coral/15 blur-3xl sm:h-[38rem] sm:w-[38rem]" />

              <div className="absolute -bottom-48 -left-32 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-3xl sm:h-[40rem] sm:w-[40rem]" />

              {/* Editorial rings */}
              <div className="absolute -right-28 -top-24 h-72 w-72 rounded-full border border-coral/30 sm:h-[32rem] sm:w-[32rem]" />

              <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full border border-coral/15 sm:h-[25rem] sm:w-[25rem]" />

              <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full border border-gold/20 sm:h-[34rem] sm:w-[34rem]" />

              {/* Fine grid */}
              <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:42px_42px]" />

              {/* Light bloom */}
              <div className="absolute left-[55%] top-[30%] h-40 w-40 rounded-full bg-white/5 blur-3xl sm:h-64 sm:w-64" />
            </div>

            {/* Floating academic objects */}

            <div className="absolute right-[7%] top-[15%] hidden animate-[pulse_5s_ease-in-out_infinite] sm:block">
              <div className="rotate-6 rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-md">
                <BookOpen
                  size={38}
                  strokeWidth={1.3}
                  className="text-gold"
                />
              </div>
            </div>

            <div className="absolute right-[19%] top-[42%] hidden -rotate-6 md:block">
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md">
                <FileText
                  size={25}
                  strokeWidth={1.3}
                  className="text-coral"
                />
              </div>
            </div>

            <div className="absolute bottom-[14%] right-[7%] hidden rotate-3 lg:block">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-md">
                <div className="mb-2 h-1.5 w-16 rounded-full bg-white/15" />
                <div className="mb-2 h-1.5 w-24 rounded-full bg-white/10" />
                <div className="h-1.5 w-12 rounded-full bg-coral/50" />
              </div>
            </div>

            {/* Hero content */}
            <div className="relative z-10 flex min-h-[600px] flex-col justify-center px-5 py-14 sm:min-h-[650px] sm:px-10 sm:py-16 lg:min-h-[700px] lg:px-16">

              <div className="max-w-3xl">

                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold backdrop-blur-md sm:text-xs">
                  <Sparkles size={14} />
                  Built for FUT Minna
                </div>

                <h1 className="font-display text-[3.15rem] leading-[0.9] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[6.8rem]">
                  Your next
                  <span className="block text-coral">
                    breakthrough
                  </span>
                  might be here.
                </h1>

                <p className="mt-6 max-w-xl text-sm leading-6 text-cream/65 sm:mt-8 sm:text-base sm:leading-7 lg:text-lg">
                  Find lecture notes, handouts, past questions
                  and useful academic resources shared by the
                  FUT Minna community.
                </p>

                {/* Hero buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#library"
                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-coral px-6 text-sm font-bold text-white shadow-lg shadow-coral/10 transition duration-300 hover:-translate-y-0.5 hover:opacity-90 active:scale-[0.98]"
                  >
                    <Search size={17} />
                    Explore resources
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>

                  <Link
                    to="/upload"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-6 text-sm font-bold text-cream backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 active:scale-[0.98]"
                  >
                    <UploadCloud size={17} />
                    Share a resource
                  </Link>
                </div>

                {/* Trust strip */}
                <div className="mt-10 flex max-w-xl flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5 sm:mt-12">
                  <div className="flex items-center gap-2 text-xs text-cream/45">
                    <div className="h-1.5 w-1.5 rounded-full bg-moss" />
                    Student-powered
                  </div>

                  <div className="flex items-center gap-2 text-xs text-cream/45">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                    Academic resources
                  </div>

                  <div className="flex items-center gap-2 text-xs text-cream/45">
                    <div className="h-1.5 w-1.5 rounded-full bg-coral" />
                    Built for FUT Minna
                  </div>
                </div>
              </div>

              {/* Floating shelf card */}
              <div className="mt-12 max-w-md sm:mt-14">
                <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3.5 shadow-2xl backdrop-blur-md transition duration-500 hover:bg-white/[0.08]">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-coral/15 text-coral">
                    <BookOpen size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                      Your academic shelf
                    </p>

                    <p className="mt-1 truncate text-sm text-cream/60">
                      One place to find what moves you forward.
                    </p>
                  </div>

                  <ArrowRight
                    size={17}
                    className="ml-auto shrink-0 text-cream/30 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink/40 to-transparent" />
          </div>
        </section>

        {/* =========================================================
            SEARCH / DISCOVERY
        ========================================================== */}

        <section
          id="library"
          className="relative z-20 mx-auto -mt-8 max-w-6xl scroll-mt-6 px-3 sm:-mt-10 sm:px-5 lg:px-8"
        >
          <div className="rounded-[1.5rem] border border-ink/10 bg-paper/95 p-2.5 shadow-[0_25px_70px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:rounded-[2rem] sm:p-4">

            {/* Search */}
            <div className="flex min-h-14 items-center gap-3 rounded-xl bg-cream px-4 sm:min-h-16 sm:rounded-2xl sm:px-5">
              <Search
                className="shrink-0 text-coral"
                size={21}
              />

              <input
                aria-label="Search materials"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search materials by title or topic..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink/35 sm:text-base"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setPage(1)
                  }}
                  className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold text-ink/40 transition hover:bg-ink/5 hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
              <select
                aria-label="Faculty"
                value={selectedFaculty}
                onChange={(e) => {
                  setSelectedFaculty(e.target.value)
                  setSelectedDepartment('')
                  setSelectedLevel('')
                  setSelectedCourse('')
                  setPage(1)
                }}
                className="min-h-12 w-full min-w-0 rounded-xl border border-ink/10 bg-cream px-3 text-sm outline-none transition duration-200 focus:border-coral focus:ring-4 focus:ring-coral/10 sm:px-4"
              >
                <option value="">All faculties</option>

                {faculties.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <select
                aria-label="Department"
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value)
                  setSelectedLevel('')
                  setSelectedCourse('')
                  setPage(1)
                }}
                className="min-h-12 w-full min-w-0 rounded-xl border border-ink/10 bg-cream px-3 text-sm outline-none transition duration-200 focus:border-coral focus:ring-4 focus:ring-coral/10 sm:px-4"
              >
                <option value="">All departments</option>

                {visibleDepartments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <select
                aria-label="Level"
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value)
                  setSelectedCourse('')
                  setPage(1)
                }}
                className="min-h-12 w-full min-w-0 rounded-xl border border-ink/10 bg-cream px-3 text-sm outline-none transition duration-200 focus:border-coral focus:ring-4 focus:ring-coral/10 sm:px-4"
              >
                <option value="">All levels</option>

                {visibleLevels.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.department_name}
                  </option>
                ))}
              </select>

              <select
                aria-label="Course"
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value)
                  setPage(1)
                }}
                className="min-h-12 w-full min-w-0 rounded-xl border border-ink/10 bg-cream px-3 text-sm outline-none transition duration-200 focus:border-coral focus:ring-4 focus:ring-coral/10 sm:px-4"
              >
                <option value="">All courses</option>

                {visibleCourses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} · {item.title}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 flex items-center gap-2 px-1">
                <span className="text-xs font-semibold text-ink/35">
                  Filters active
                </span>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-bold text-coral transition hover:text-ink"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================
            LIBRARY INTRO
        ========================================================== */}

        <section className="mx-auto max-w-7xl px-3 pt-16 sm:px-5 sm:pt-24 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-coral sm:text-sm">
                <SlidersHorizontal size={15} />
                Explore the shelf
              </p>

              <h2 className="font-display text-[2.6rem] leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                Materials for
                <span className="text-coral"> your next move.</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-ink/50 sm:text-base">
                Find something useful. Learn from it.
                Then leave something useful for the next
                student.
              </p>
            </div>

            {/* Stats */}
            <div className="grid w-full grid-cols-3 divide-x divide-ink/10 rounded-2xl border border-ink/10 bg-paper p-3 shadow-sm sm:max-w-md sm:p-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="px-2 text-center sm:px-4"
                >
                  <strong className="block font-display text-2xl tracking-tight text-ink sm:text-3xl">
                    {stat.value}
                  </strong>

                  <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.13em] text-ink/35 sm:text-[10px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            ERROR
        ========================================================== */}

        {error && (
          <div className="mx-auto mt-8 max-w-7xl px-3 sm:px-5 lg:px-8">
            <div
              role="alert"
              className="rounded-xl border border-coral/10 bg-coral/10 px-4 py-3 text-sm leading-5 text-coral sm:rounded-2xl sm:px-5 sm:py-4"
            >
              {error}
            </div>
          </div>
        )}

        {/* =========================================================
            MATERIALS
        ========================================================== */}

        <section className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">

          {loading ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-64 animate-pulse rounded-2xl bg-ink/5" />
              <div className="h-64 animate-pulse rounded-2xl bg-ink/5" />
              <div className="h-64 animate-pulse rounded-2xl bg-ink/5" />
            </div>
          ) : materials.length ? (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {materials.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                  />
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-ink/45">
                  {count} material
                  {count === 1 ? '' : 's'} found
                </span>

                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    disabled={page === 1}
                    onClick={() =>
                      setPage(
                        (current) => current - 1,
                      )
                    }
                    className="min-h-11 flex-1 rounded-xl border border-ink/15 px-4 text-sm font-bold transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-30 sm:flex-none"
                  >
                    Previous
                  </button>

                  <button
                    disabled={materials.length < 6}
                    onClick={() =>
                      setPage(
                        (current) => current + 1,
                      )
                    }
                    className="min-h-11 flex-1 rounded-xl bg-ink px-5 text-sm font-bold text-cream transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-30 sm:flex-none"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="relative mt-8 overflow-hidden rounded-[1.5rem] border border-dashed border-ink/15 bg-paper px-5 py-16 text-center sm:rounded-[2rem] sm:px-8 sm:py-20">

              <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral/10 blur-3xl" />

              <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-coral/10 text-coral">
                <Search size={24} />
              </div>

              <h3 className="relative mt-5 font-display text-3xl">
                Nothing here yet.
              </h3>

              <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-ink/50">
                Try another search or clear your filters.
                If you have the material, you could be the
                student who adds it.
              </p>

              <Link
                to="/upload"
                className="relative mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-coral px-5 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <UploadCloud size={17} />
                Contribute a material
              </Link>
            </div>
          )}
        </section>

        {/* =========================================================
            CONTRIBUTION CTA
        ========================================================== */}

        <section className="mx-auto max-w-7xl px-3 pt-20 sm:px-5 sm:pt-28 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-coral px-5 py-10 text-white shadow-soft sm:rounded-[2.75rem] sm:px-10 sm:py-14 lg:px-14">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[28px] border-white/10" />

            <div className="absolute -bottom-28 left-[40%] h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute right-[35%] top-1/2 hidden h-2 w-2 rounded-full bg-white/30 sm:block" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-white/65">
                  <Share2 size={15} />
                  Give something back
                </div>

                <h2 className="font-display text-[2.6rem] leading-[0.98] tracking-tight sm:text-5xl">
                  Someone is looking for
                  <span className="block text-white/75">
                    what you already have.
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                  Share notes, handouts, tutorials or other
                  useful resources and make the next student's
                  journey a little easier.
                </p>
              </div>

              <Link
                to="/upload"
                className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-ink shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-cream"
              >
                Contribute now
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>

        <div className="h-4 sm:h-8" />
      </main>
    </AppShell>
  )
}