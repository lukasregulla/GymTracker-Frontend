export const THEME_COLORS = [
  { id: 'orange', label: 'Orange', rgb: '255 107 53',  bgClass: 'bg-[#FF6B35]' },
  { id: 'blue',   label: 'Blue',   rgb: '59 130 246',  bgClass: 'bg-blue-500'  },
  { id: 'green',  label: 'Green',  rgb: '34 197 94',   bgClass: 'bg-green-500' },
  { id: 'purple', label: 'Purple', rgb: '168 85 247',  bgClass: 'bg-purple-500'},
  { id: 'red',    label: 'Red',    rgb: '239 68 68',   bgClass: 'bg-red-500'   },
  { id: 'teal',   label: 'Teal',   rgb: '20 184 166',  bgClass: 'bg-teal-500'  },
] as const

export type ThemeColorId = (typeof THEME_COLORS)[number]['id']

const STORAGE_KEY = 'gym_theme_color'
const DEFAULT_ID: ThemeColorId = 'orange'

export function applyThemeColor(id: ThemeColorId): void {
  const color = THEME_COLORS.find((c) => c.id === id) ?? THEME_COLORS[0]
  document.documentElement.style.setProperty('--color-primary-rgb', color.rgb)
  localStorage.setItem(STORAGE_KEY, id)
}

export function loadThemeColor(): ThemeColorId {
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeColorId | null
  const id = THEME_COLORS.some((c) => c.id === saved) ? (saved as ThemeColorId) : DEFAULT_ID
  applyThemeColor(id)
  return id
}
