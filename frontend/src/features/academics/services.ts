import { api } from '../../api/client'
import type { Course, Department, Faculty, Level, Pagination, Semester } from '../../types/api'

export const academicService = {
  faculties: async () => (await api.get<Faculty[]>('/academics/faculties/')).data,
  departments: async () => (await api.get<Department[]>('/academics/departments/')).data,
  levels: async () => (await api.get<Level[]>('/academics/levels/')).data,
  semesters: async () => (await api.get<Semester[]>('/academics/semesters/')).data,
  courses: async () => (await api.get<Course[]>('/academics/courses/')).data,
}
