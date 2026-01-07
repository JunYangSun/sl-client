'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/stores/theme'
import { themes } from '@/config/themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeName, mode } = useThemeStore()

    // 在组件渲染前就应用主题，避免闪烁
  // 立即读取 localStorage 中的主题设置并应用到 documentElement
  // const [isThemeInitialized, setIsThemeInitialized] = useState(false)

  // useEffect(() => {
  //   // 组件挂载时立即应用主题
  //   const root = document.documentElement

  //   // 先尝试从 localStorage 读取主题设置（避免依赖 zustand 的初始化）
  //   const savedTheme = localStorage.getItem('theme-storage')
  //   if (savedTheme) {
  //     try {
  //       const storageData = JSON.parse(savedTheme)
  //       // zustand persist 存储的数据格式是 { state: {...}, version?: number }
  //       const { mode: savedMode, themeName: savedThemeName } = storageData.state as {
  //         mode: 'light' | 'dark';
  //         themeName: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'slate'
  //       }

  //       // 应用深色模式类
  //       if (savedMode === 'dark') {
  //         root.classList.add('dark')
  //       } else {
  //         root.classList.remove('dark')
  //       }

  //       // 应用主题颜色
  //       if (savedThemeName !== 'slate') {
  //         const themeColors = themes[savedThemeName][savedMode]
  //         root.style.setProperty('--primary', themeColors.primary)
  //         root.style.setProperty('--primary-foreground', themeColors.primaryForeground)
  //         root.style.setProperty('--secondary', themeColors.secondary)
  //         root.style.setProperty('--secondary-foreground', themeColors.secondaryForeground)
  //         root.style.setProperty('--accent', themeColors.accent)
  //         root.style.setProperty('--accent-foreground', themeColors.accentForeground)
  //         root.style.setProperty('--ring', themeColors.ring)
  //         root.style.setProperty('--chart-1', themeColors.chart1)
  //         root.style.setProperty('--chart-2', themeColors.chart2)
  //         root.style.setProperty('--chart-3', themeColors.chart3)
  //         root.style.setProperty('--chart-4', themeColors.chart4)
  //         root.style.setProperty('--chart-5', themeColors.chart5)
  //       }
  //     } catch (e) {
  //       console.error('Failed to parse theme from localStorage:', e)
  //     }
  //   }

  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   setIsThemeInitialized(true)
  // }, [])

  // 监听主题变化
  useEffect(() => {
    const root = document.documentElement

    // Only apply theme colors if not using the default 'slate' theme
    if (themeName !== 'slate') {
      const themeColors = themes[themeName][mode]

      // Apply theme colors
      root.style.setProperty('--primary', themeColors.primary)
      root.style.setProperty('--primary-foreground', themeColors.primaryForeground)
      root.style.setProperty('--secondary', themeColors.secondary)
      root.style.setProperty('--secondary-foreground', themeColors.secondaryForeground)
      root.style.setProperty('--accent', themeColors.accent)
      root.style.setProperty('--accent-foreground', themeColors.accentForeground)
      root.style.setProperty('--ring', themeColors.ring)
      root.style.setProperty('--chart-1', themeColors.chart1)
      root.style.setProperty('--chart-2', themeColors.chart2)
      root.style.setProperty('--chart-3', themeColors.chart3)
      root.style.setProperty('--chart-4', themeColors.chart4)
      root.style.setProperty('--chart-5', themeColors.chart5)
    } else {
      // Remove inline styles to use CSS defaults
      root.style.removeProperty('--primary')
      root.style.removeProperty('--primary-foreground')
      root.style.removeProperty('--secondary')
      root.style.removeProperty('--secondary-foreground')
      root.style.removeProperty('--accent')
      root.style.removeProperty('--accent-foreground')
      root.style.removeProperty('--ring')
      root.style.removeProperty('--chart-1')
      root.style.removeProperty('--chart-2')
      root.style.removeProperty('--chart-3')
      root.style.removeProperty('--chart-4')
      root.style.removeProperty('--chart-5')
    }

    // Update dark mode class
    if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [themeName, mode])

    // 确保主题初始化后再渲染子组件，避免 hydration 不匹配
    // if (!isThemeInitialized) {
    //   return null
    // }
    
  return <>{children}</>
}
