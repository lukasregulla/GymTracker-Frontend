import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { THEME_COLORS, applyThemeColor, loadThemeColor, type ThemeColorId } from '@/lib/theme'

export default function Profile() {
  const navigate = useNavigate()
  const username = localStorage.getItem('gym_username') ?? 'Unknown'
  const [activeColorId, setActiveColorId] = useState<ThemeColorId>(() => loadThemeColor())

  const handleLogout = () => {
    localStorage.removeItem('gym_token')
    localStorage.removeItem('gym_username')
    navigate('/login')
  }

  const handleColorSelect = (id: ThemeColorId) => {
    applyThemeColor(id)
    setActiveColorId(id)
  }

  return (
    <div className="px-4 pt-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      {/* Avatar + name */}
      <div className="flex flex-col items-center py-6">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-white">{username}</h2>
      </div>

      {/* Account section */}
      <div className="bg-surface border border-border rounded-xl divide-y divide-border">
        <div className="px-4 py-3">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Username</p>
          <p className="text-white font-medium">{username}</p>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-surface border border-border rounded-xl">
        <div className="px-4 py-3">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">Accent Color</p>
          <div className="flex gap-3 flex-wrap">
            {THEME_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                aria-label={`${color.label} theme`}
                onClick={() => handleColorSelect(color.id)}
                className={`w-9 h-9 rounded-full transition-all active:scale-90 ${color.bgClass} ${
                  activeColorId === color.id
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-surface scale-110'
                    : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* App info */}
      <div className="bg-surface border border-border rounded-xl divide-y divide-border">
        <div className="px-4 py-3">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">App</p>
          <p className="text-white font-medium">GymTracker</p>
          <p className="text-text-secondary text-xs mt-0.5">v1.0.0</p>
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full border-danger/30 text-danger"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </Button>
    </div>
  )
}
