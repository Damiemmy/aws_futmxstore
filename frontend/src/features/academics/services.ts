import { api } from '../../api/client'
import type { Course, Department, Faculty, Level, CourseCreatePayload, Semester,AcademicSession,Programme} from '../../types/api'

export const academicService = {
  faculties: async () => (await api.get<Faculty[]>('/academics/faculties/')).data,
  departments: async () => (await api.get<Department[]>('/academics/departments/')).data,
  levels: async () => (await api.get<Level[]>('/academics/levels/')).data,
  semesters: async () => (await api.get<Semester[]>('/academics/semesters/')).data,
  courses: async () => (await api.get<Course[]>('/academics/courses/')).data,
  programmes: async () => (await api.get<Programme[]>('/academics/programmes/')).data,
  academicSessions: async () => (await api.get<AcademicSession[]>('/academics/sessions/')).data,
  createCourse: async (payload: CourseCreatePayload) =>
    (await api.post<Course>('/academics/courses/create/', payload)).data,
}
