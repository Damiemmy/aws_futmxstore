import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { setAccessToken } from '../api/client'
import { getMe, login, logout, refreshAccess } from '../features/authentication/services'
import type { LoginRequest, User } from '../types/api'

interface AuthState {
  user: User | null
  access: string | null
  refresh: string | null
  isLoading: boolean
  signIn: (payload: LoginRequest) => Promise<void>
  hydrate: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      access: null,
      refresh: null,
      isLoading: false,
      signIn: async (payload) => {
        set({ isLoading: true })
        const session = await login(payload)
        set({ ...session, isLoading: false })
        setAccessToken(session.access)
      },
      hydrate: async () => {
        const { access, refresh } = get()
        if (!access || !refresh) return
        setAccessToken(access)
        set({ isLoading: true })
        try {
          set({ user: await getMe(), isLoading: false })
        } catch {
          try {
            const next = await refreshAccess(refresh)
            set({ access: next.access })
            setAccessToken(next.access)
            set({ user: await getMe(), isLoading: false })
          } catch {
            set({ user: null, access: null, refresh: null, isLoading: false })
            setAccessToken(null)
          }
        }
      },
      signOut: async () => {
        const { refresh } = get()
        if (refresh) {
          try {
            await logout(refresh)
          } catch {
            /* local session still gets cleared */
          }
        }
        set({ user: null, access: null, refresh: null })
        setAccessToken(null)
      },
    }),
    {
      name: 'futmx-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, access: state.access, refresh: state.refresh }),
    },
  ),
)
