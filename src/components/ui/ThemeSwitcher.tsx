'use client'

import { Moon, Sun, Palette } from 'lucide-react'
import { useThemeStore } from '@/stores/theme'
import { themeLabels, type ThemeName } from '@/config/themes'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ThemeSwitcher() {
  const { themeName, mode, setThemeName, toggleMode } = useThemeStore()

  return (
    <div className="flex items-center gap-2">
      <Select value={themeName} onValueChange={(value) => setThemeName(value as ThemeName)}>
        <SelectTrigger className="w-[120px]">
          <Palette className="mr-2 h-4 w-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(themeLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={toggleMode}
        aria-label="Toggle theme mode"
      >
        {mode === 'light' ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
      </Button>
    </div>
  )
}
