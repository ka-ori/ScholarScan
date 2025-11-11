import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      
      setHasHydrated: (state) => {
        set({ _hasHydrated: state })
      },
      
      login: (token, user) => {
        set({ token, user, isAuthenticated: true })
      },
      
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false })
      },
      
      updateUser: (user) => {
        set({ user })
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      }
    }
  )
)

