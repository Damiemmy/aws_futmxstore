export type Role = string

export interface User {
  id: number
  email: string
  username: string | null
  is_verified: boolean
  roles: Role[]
}

export interface Faculty {
  id: number
  name: string
  slug: string
}
export interface Department {
  id: number
  name: string
  slug: string
  faculty: number
  faculty_name: string
}
export interface Programme {
  id: number
  name: string
  slug: string
  department: number
  department_name: string
}
export interface AcademicSession {
  id: number
  name: string
  start_year: number
  end_year: number
  is_active: boolean
}
export interface Level {
  id: number
  name: string
  department: number
  department_name: string
  programme: number | null
  programme_name: string | null
}
export interface Semester {
  id: number
  name: string
  level: number
  level_name: string
}
export interface Course {
  id: number
  code: string
  unit: number
  title: string
  semester: number
  semester_name: string
}
export interface CourseCreatePayload {
  code: string
  title: string
  unit: number
  semester: number
}

/*export interface Material {
  id: number
  course: number
  course_code: string
  course_offering: number | null
  course_offering_session: string | null
  title: string
  description: string
  file: string
  uploaded_by: number | null
  created_at: string
  updated_at: string
}*/


export interface Material {
  id: number

  // Course
  course: number
  course_code: string
  course_title: string
  course_unit: number

  // Academic hierarchy
  faculty_name: string | null
  department_name: string | null
  programme_name: string | null
  level_name: string | null
  semester_name: string | null

  // Academic session
  course_offering: number | null
  course_offering_session: string | null

  // Material
  title: string
  description: string
  file: string
  file_name: string | null
  file_extension: string | null
  file_size: number | null

  // Contributor
  uploaded_by: number | null
  uploaded_by_username: string | null

  // Dates
  created_at: string
  updated_at: string
}


export interface Pagination<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface LoginRequest {
  email: string
  password: string
}
export interface RegisterRequest {
  email: string
  username: string
  password: string
  confirm_password: string
}
export interface LoginResponse {
  user: User
  access: string
  refresh: string
}
export interface ApiError {
  detail?: string
  [field: string]: string | string[] | undefined
}
export interface MaterialUploadPayload {
  course: number
  academic_session: number
  title: string
  description: string
  file: File
}
