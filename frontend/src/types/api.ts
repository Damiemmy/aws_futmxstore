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
export interface Level {
  id: number
  name: string
  department: number
  department_name: string
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
  title: string
  semester: number
  semester_name: string
}
export interface Material {
  id: number
  course: number
  course_code: string
  title: string
  description: string
  file: string
  uploaded_by: number | null
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
  title: string
  description: string
  file: File
}
