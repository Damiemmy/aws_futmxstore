import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { MaterialCard } from '../components/MaterialCard'
import { academicService } from '../features/academics/services'
import { materialService } from '../features/materials/services'
import { getApiMessage } from '../api/client'
import type { Course, Department, Faculty, Level, Material, Semester } from '../types/api'

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
      .catch((e: unknown) => setError(getApiMessage(e, 'Academic options could not be loaded.')))
  }, [])
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true)
      void materialService
        .list({
          course: selectedCourse ? Number(selectedCourse) : undefined,
          search: search || undefined,
          page,
        })
        .then((data) => {
          setMaterials(data.results)
          setCount(data.count)
          setError('')
        })
        .catch((e: unknown) => setError(getApiMessage(e, 'Materials could not be loaded.')))
        .finally(() => setLoading(false))
    }, 350)
    return () => window.clearTimeout(timer)
  }, [selectedCourse, search, page])
  const stats = useMemo(
    () => [
      { value: faculties.length, label: 'faculties' },
      { value: departments.length, label: 'departments' },
      { value: courses.length, label: 'courses' },
    ],
    [faculties.length, departments.length, courses.length],
  )
  const visibleDepartments = selectedFaculty
    ? departments.filter((item) => item.faculty === Number(selectedFaculty))
    : departments
  const visibleLevels = selectedDepartment
    ? levels.filter((item) => item.department === Number(selectedDepartment))
    : levels
  const visibleSemesters = selectedLevel
    ? semesters.filter((item) => item.level === Number(selectedLevel))
    : semesters
  const visibleCourses = selectedLevel
    ? courses.filter((item) => visibleSemesters.some((semester) => semester.id === item.semester))
    : courses
  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-5 pb-12 pt-10 lg:px-8 lg:pt-16">
        <section className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-cream sm:px-12 lg:px-16 lg:py-16">
          <div className="relative z-10 max-w-2xl fade-up">
            <div className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[.18em] text-gold">
              <Sparkles size={16} /> Your study shelf
            </div>
            <h1 className="font-display text-5xl leading-[.98] tracking-tight sm:text-7xl">
              The right material changes everything.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-cream/70">
              Search past questions, lecture notes and handouts from across your academic journey.
            </p>
          </div>
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[35px] border-coral/70" />
          <div className="absolute -bottom-32 right-40 h-64 w-64 rounded-full border-[25px] border-gold/50" />
        </section>
        <section className="-mt-8 relative z-10 rounded-2xl border border-ink/10 bg-paper p-3 shadow-soft sm:p-4">
          <div className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3">
            <Search className="shrink-0 text-coral" size={21} />
            <input
              aria-label="Search materials"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search materials by title or topic..."
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink/40"
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select
              aria-label="Faculty"
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value)
                setSelectedDepartment('')
                setSelectedLevel('')
                setSelectedCourse('')
              }}
              className="rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm"
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
              }}
              className="rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm"
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
              }}
              className="rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm"
            >
              <option value="">All levels</option>
              {visibleLevels.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.department_name}
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
              className="rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm"
            >
              <option value="">All courses</option>
              {visibleCourses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} · {item.title}
                </option>
              ))}
            </select>
          </div>
        </section>
        <div className="mt-16 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-coral">
              <SlidersHorizontal size={15} /> Browse library
            </p>
            <h2 className="font-display text-4xl">Materials for your next move</h2>
          </div>
          <div className="flex gap-5 text-sm text-ink/55">
            {stats.map((stat) => (
              <span key={stat.label}>
                <strong className="text-xl text-ink">{stat.value}</strong> {stat.label}
              </span>
            ))}
          </div>
        </div>
        {error && (
          <div role="alert" className="mt-6 rounded-xl bg-coral/10 p-4 text-sm text-coral">
            {error}
          </div>
        )}
        {loading ? (
          <div className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-64 animate-pulse rounded-2xl bg-ink/10" />
            <div className="h-64 animate-pulse rounded-2xl bg-ink/10" />
            <div className="h-64 animate-pulse rounded-2xl bg-ink/10" />
          </div>
        ) : materials.length ? (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between text-sm">
              <span className="text-ink/55">
                {count} material{count === 1 ? '' : 's'} found
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-full border border-ink/15 px-4 py-2 disabled:opacity-35"
                >
                  Previous
                </button>
                <button
                  disabled={materials.length < 6}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-full bg-ink px-4 py-2 text-cream disabled:opacity-35"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-ink/20 bg-paper px-6 py-16 text-center">
            <h3 className="font-display text-2xl">Nothing here yet</h3>
            <p className="mt-2 text-sm text-ink/55">
              Try another search or clear your course filter.
            </p>
          </div>
        )}
      </main>
    </AppShell>
  )
}
