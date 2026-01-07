'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/stores/theme'
import { themes } from '@/config/themes'

const THEME_STYLE_ID = 'theme-variables'

const toCssVar = (key: string) =>
  key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).replace(/(\d+)/g, '-$1')

const buildThemeCss = () =>
  Object.entries(themes)
    .filter(([name]) => name !== 'slate')
    .map(([name, theme]) => {
      const lightVars = Object.entries(theme.light)
        .map(([key, value]) => `--${toCssVar(key)}: ${value};`)
        .join('')
      const darkVars = Object.entries(theme.dark)
        .map(([key, value]) => `--${toCssVar(key)}: ${value};`)
        .join('')
      return `:root[data-theme="${name}"]{${lightVars}}:root.dark[data-theme="${name}"]{${darkVars}}`
    })
    .join('')

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeName, mode } = useThemeStore()

  // 监听主题变化
  useEffect(() => {
    const root = document.documentElement
    if (!document.getElementById(THEME_STYLE_ID)) {
      const style = document.createElement('style')
      style.id = THEME_STYLE_ID
      style.textContent = buildThemeCss()
      document.head.appendChild(style)
    }

    if (themeName !== 'slate') {
      root.setAttribute('data-theme', themeName)
    } else {
      root.removeAttribute('data-theme')
    }

    // Update dark mode class
    if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    document.cookie = `theme-mode=${mode}; path=/; max-age=31536000; samesite=lax`
  }, [themeName, mode])

    
  return <>{children}</>
}
