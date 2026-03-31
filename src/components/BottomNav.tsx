import { NavLink } from 'react-router-dom'
import { Home, Calendar, Plus, Dumbbell, LayoutTemplate } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/sessions/new', icon: Plus, label: 'Log', isCenter: true },
  { to: '/exercises', icon: Dumbbell, label: 'Exercises' },
  { to: '/templates', icon: LayoutTemplate, label: 'Templates' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-surface border-t border-border z-50 flex items-center">
      {navItems.map(({ to, icon: Icon, label, isCenter }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${
              isActive ? 'text-primary' : 'text-text-secondary'
            }`
          }
        >
          {isCenter ? (
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg -mt-4">
              <Icon className="w-6 h-6 text-white" />
            </div>
          ) : (
            <>
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
