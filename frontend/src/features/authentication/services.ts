import { api } from '../../api/client'
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '../../types/api'

export const login = async (payload: LoginRequest) =>
  (await api.post<LoginResponse>('/authentication/login/', payload)).data
export const register = async (payload: RegisterRequest) =>
  (await api.post<User>('/authentication/register/', payload)).data
export const getMe = async () => (await api.get<User>('/authentication/me/')).data
export const logout = async (refresh: string) => {
  await api.post('/authentication/logout/', { refresh })
}
export const refreshAccess = async (refresh: string) =>
  (await api.post<{ access: string }>('/authentication/refresh/', { refresh })).data
