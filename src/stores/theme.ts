import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type ThemeName, type ThemeMode } from '@/config/themes'

interface ThemeState {
  themeName: ThemeName
  mode: ThemeMode
  setThemeName: (name: ThemeName) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeName: 'slate',
      mode: 'dark',
      setThemeName: (name) => set({ themeName: name }),
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'theme-storage',
    }
  )
)
