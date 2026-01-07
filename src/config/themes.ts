export type ThemeMode = 'light' | 'dark'
export type ThemeName = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'slate'

export interface ThemeColors {
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  ring: string
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
}

export interface ThemeConfig {
  light: ThemeColors
  dark: ThemeColors
}

export const themes: Record<ThemeName, ThemeConfig> = {
  blue: {
    light: {
      primary: 'oklch(0.478 0.166 252.665)',
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.96 0.013 252.665)',
      secondaryForeground: 'oklch(0.205 0 0)',
      accent: 'oklch(0.96 0.013 252.665)',
      accentForeground: 'oklch(0.205 0 0)',
      ring: 'oklch(0.478 0.166 252.665)',
      chart1: 'oklch(0.646 0.222 252.665)',
      chart2: 'oklch(0.6 0.118 252.665)',
      chart3: 'oklch(0.398 0.07 252.665)',
      chart4: 'oklch(0.828 0.189 252.665)',
      chart5: 'oklch(0.769 0.188 252.665)',
    },
    dark: {
      primary: 'oklch(0.707 0.156 252.665)',
      primaryForeground: 'oklch(0.145 0 0)',
      secondary: 'oklch(0.269 0.023 252.665)',
      secondaryForeground: 'oklch(0.985 0 0)',
      accent: 'oklch(0.269 0.023 252.665)',
      accentForeground: 'oklch(0.985 0 0)',
      ring: 'oklch(0.707 0.156 252.665)',
      chart1: 'oklch(0.488 0.243 252.665)',
      chart2: 'oklch(0.696 0.17 252.665)',
      chart3: 'oklch(0.769 0.188 252.665)',
      chart4: 'oklch(0.627 0.265 252.665)',
      chart5: 'oklch(0.645 0.246 252.665)',
    },
  },
  green: {
    light: {
      primary: 'oklch(0.478 0.166 142.495)',
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.96 0.013 142.495)',
      secondaryForeground: 'oklch(0.205 0 0)',
      accent: 'oklch(0.96 0.013 142.495)',
      accentForeground: 'oklch(0.205 0 0)',
      ring: 'oklch(0.478 0.166 142.495)',
      chart1: 'oklch(0.646 0.222 142.495)',
      chart2: 'oklch(0.6 0.118 162.48)',
      chart3: 'oklch(0.398 0.07 180)',
      chart4: 'oklch(0.828 0.189 120)',
      chart5: 'oklch(0.769 0.188 142.495)',
    },
    dark: {
      primary: 'oklch(0.707 0.156 142.495)',
      primaryForeground: 'oklch(0.145 0 0)',
      secondary: 'oklch(0.269 0.023 142.495)',
      secondaryForeground: 'oklch(0.985 0 0)',
      accent: 'oklch(0.269 0.023 142.495)',
      accentForeground: 'oklch(0.985 0 0)',
      ring: 'oklch(0.707 0.156 142.495)',
      chart1: 'oklch(0.488 0.243 142.495)',
      chart2: 'oklch(0.696 0.17 162.48)',
      chart3: 'oklch(0.769 0.188 142.495)',
      chart4: 'oklch(0.627 0.265 120)',
      chart5: 'oklch(0.645 0.246 162.48)',
    },
  },
  purple: {
    light: {
      primary: 'oklch(0.478 0.166 303.9)',
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.96 0.013 303.9)',
      secondaryForeground: 'oklch(0.205 0 0)',
      accent: 'oklch(0.96 0.013 303.9)',
      accentForeground: 'oklch(0.205 0 0)',
      ring: 'oklch(0.478 0.166 303.9)',
      chart1: 'oklch(0.646 0.222 303.9)',
      chart2: 'oklch(0.6 0.118 280)',
      chart3: 'oklch(0.398 0.07 320)',
      chart4: 'oklch(0.828 0.189 290)',
      chart5: 'oklch(0.769 0.188 303.9)',
    },
    dark: {
      primary: 'oklch(0.707 0.156 303.9)',
      primaryForeground: 'oklch(0.145 0 0)',
      secondary: 'oklch(0.269 0.023 303.9)',
      secondaryForeground: 'oklch(0.985 0 0)',
      accent: 'oklch(0.269 0.023 303.9)',
      accentForeground: 'oklch(0.985 0 0)',
      ring: 'oklch(0.707 0.156 303.9)',
      chart1: 'oklch(0.488 0.243 303.9)',
      chart2: 'oklch(0.696 0.17 280)',
      chart3: 'oklch(0.769 0.188 320)',
      chart4: 'oklch(0.627 0.265 303.9)',
      chart5: 'oklch(0.645 0.246 290)',
    },
  },
  orange: {
    light: {
      primary: 'oklch(0.478 0.166 41.116)',
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.96 0.013 41.116)',
      secondaryForeground: 'oklch(0.205 0 0)',
      accent: 'oklch(0.96 0.013 41.116)',
      accentForeground: 'oklch(0.205 0 0)',
      ring: 'oklch(0.478 0.166 41.116)',
      chart1: 'oklch(0.646 0.222 41.116)',
      chart2: 'oklch(0.6 0.118 70.08)',
      chart3: 'oklch(0.398 0.07 84.429)',
      chart4: 'oklch(0.828 0.189 30)',
      chart5: 'oklch(0.769 0.188 41.116)',
    },
    dark: {
      primary: 'oklch(0.707 0.156 41.116)',
      primaryForeground: 'oklch(0.145 0 0)',
      secondary: 'oklch(0.269 0.023 41.116)',
      secondaryForeground: 'oklch(0.985 0 0)',
      accent: 'oklch(0.269 0.023 41.116)',
      accentForeground: 'oklch(0.985 0 0)',
      ring: 'oklch(0.707 0.156 41.116)',
      chart1: 'oklch(0.488 0.243 41.116)',
      chart2: 'oklch(0.696 0.17 70.08)',
      chart3: 'oklch(0.769 0.188 84.429)',
      chart4: 'oklch(0.627 0.265 30)',
      chart5: 'oklch(0.645 0.246 41.116)',
    },
  },
  pink: {
    light: {
      primary: 'oklch(0.478 0.166 350)',
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.96 0.013 350)',
      secondaryForeground: 'oklch(0.205 0 0)',
      accent: 'oklch(0.96 0.013 350)',
      accentForeground: 'oklch(0.205 0 0)',
      ring: 'oklch(0.478 0.166 350)',
      chart1: 'oklch(0.646 0.222 350)',
      chart2: 'oklch(0.6 0.118 320)',
      chart3: 'oklch(0.398 0.07 10)',
      chart4: 'oklch(0.828 0.189 340)',
      chart5: 'oklch(0.769 0.188 350)',
    },
    dark: {
      primary: 'oklch(0.707 0.156 350)',
      primaryForeground: 'oklch(0.145 0 0)',
      secondary: 'oklch(0.269 0.023 350)',
      secondaryForeground: 'oklch(0.985 0 0)',
      accent: 'oklch(0.269 0.023 350)',
      accentForeground: 'oklch(0.985 0 0)',
      ring: 'oklch(0.707 0.156 350)',
      chart1: 'oklch(0.488 0.243 350)',
      chart2: 'oklch(0.696 0.17 320)',
      chart3: 'oklch(0.769 0.188 10)',
      chart4: 'oklch(0.627 0.265 340)',
      chart5: 'oklch(0.645 0.246 350)',
    },
  },
  slate: {
    light: {
      primary: 'oklch(0.205 0 0)',
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.97 0 0)',
      secondaryForeground: 'oklch(0.205 0 0)',
      accent: 'oklch(0.97 0 0)',
      accentForeground: 'oklch(0.205 0 0)',
      ring: 'oklch(0.708 0 0)',
      chart1: 'oklch(0.646 0.222 41.116)',
      chart2: 'oklch(0.6 0.118 184.704)',
      chart3: 'oklch(0.398 0.07 227.392)',
      chart4: 'oklch(0.828 0.189 84.429)',
      chart5: 'oklch(0.769 0.188 70.08)',
    },
    dark: {
      primary: 'oklch(0.922 0 0)',
      primaryForeground: 'oklch(0.205 0 0)',
      secondary: 'oklch(0.269 0 0)',
      secondaryForeground: 'oklch(0.985 0 0)',
      accent: 'oklch(0.269 0 0)',
      accentForeground: 'oklch(0.985 0 0)',
      ring: 'oklch(0.556 0 0)',
      chart1: 'oklch(0.488 0.243 264.376)',
      chart2: 'oklch(0.696 0.17 162.48)',
      chart3: 'oklch(0.769 0.188 70.08)',
      chart4: 'oklch(0.627 0.265 303.9)',
      chart5: 'oklch(0.645 0.246 16.439)',
    },
  },
}

export const themeLabels: Record<ThemeName, string> = {
  blue: '蓝色',
  green: '绿色',
  purple: '紫色',
  orange: '橙色',
  pink: '粉色',
  slate: '灰色',
}
