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

const getInitialMode = (): ThemeMode => {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

const getInitialThemeName = (): ThemeName => {
  if (typeof document === 'undefined') return 'slate'
  const attr = document.documentElement.getAttribute('data-theme')
  return (attr as ThemeName) || 'slate'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeName: getInitialThemeName(),
      mode: getInitialMode(),
      setThemeName: (name) => set({ themeName: name }),
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'theme-storage',
    }
  )
)
