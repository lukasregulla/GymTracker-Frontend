import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { THEME_COLORS, applyThemeColor, loadThemeColor, type ThemeColorId } from '@/lib/theme'
import { useCalendarSubscription, useResetCalendarSubscription } from '@/hooks/useCalendarSubscription'
import { toast } from '@/hooks/use-toast'

export default function Profile() {
  const navigate = useNavigate()
  const username = localStorage.getItem('gym_username') ?? 'Unknown'
  const [activeColorId, setActiveColorId] = useState<ThemeColorId>(() => loadThemeColor())
  const [resetOpen, setResetOpen] = useState(false)

  const { data: calData, isLoading: calIsLoading } = useCalendarSubscription()
  const resetMutation = useResetCalendarSubscription()

  const handleLogout = () => {
    localStorage.removeItem('gym_token')
    localStorage.removeItem('gym_username')
    navigate('/login')
  }

  const handleColorSelect = (id: ThemeColorId) => {
    applyThemeColor(id)
    setActiveColorId(id)
  }

  const handleCopy = async () => {
    if (!calData?.calendarUrl) return
    await navigator.clipboard.writeText(calData.calendarUrl)
    toast({ title: 'Copied!', variant: 'success' })
  }

  const handleReset = () => {
    resetMutation.mutate(undefined, {
      onSuccess: () => {
        setResetOpen(false)
        toast({ title: 'Subscription link reset', variant: 'success' })
      },
    })
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

      {/* Calendar Subscription */}
      <div className="bg-surface border border-border rounded-xl">
        <div className="px-4 py-3 space-y-3">
          <p className="text-text-secondary text-xs uppercase tracking-wider">Calendar Subscription</p>
          <p className="text-text-secondary text-sm">
            Paste this URL into Apple Calendar, Google Calendar, or Outlook to sync your workout schedule.
          </p>

          {calIsLoading ? (
            <div className="h-10 bg-surface2 rounded-lg animate-shimmer" />
          ) : (
            <div className="flex gap-2">
              <Input
                readOnly
                value={calData?.calendarUrl ?? ''}
                className="flex-1 text-xs text-text-secondary"
              />
              <Button
                variant="outline"
                size="icon"
                aria-label="Copy URL"
                onClick={handleCopy}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-danger px-0"
            onClick={() => setResetOpen(true)}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Reset subscription link
          </Button>
        </div>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset subscription link?</DialogTitle>
            <DialogDescription>
              Your current calendar URL will stop working. You'll need to re-add the new URL to any calendars using it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={handleReset}
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? 'Resetting…' : 'Reset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
