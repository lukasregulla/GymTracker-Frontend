import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  format, startOfMonth, endOfMonth, startOfWeek, addDays,
  isSameMonth, isSameDay, parseISO, addMonths, subMonths
} from 'date-fns'
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react'
import { useSessions } from '@/hooks/useSessions'
import { Badge } from '@/components/ui/badge'

export default function Calendar() {
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(new Date())

  const from = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
  const to = format(endOfMonth(currentMonth), 'yyyy-MM-dd')
  const { data: sessions } = useSessions(from, to)

  // Build calendar grid
  const monthStart = startOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    days.push(addDays(calendarStart, i))
  }

  const selectedDaySessions = sessions?.filter(
    (s) => s.scheduledDate && isSameDay(parseISO(s.scheduledDate), selectedDay)
  ) ?? []

  return (
    <div className="px-4 pt-6 space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h1>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-xs text-text-secondary py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const daySessions = sessions?.filter(
            (s) => s.scheduledDate && isSameDay(parseISO(s.scheduledDate), day)
          ) ?? []
          const hasCompleted = daySessions.some((s) => s.isCompleted)
          const hasScheduled = daySessions.some((s) => !s.isCompleted)
          const isSelected = isSameDay(day, selectedDay)
          const isToday = isSameDay(day, new Date())
          const inMonth = isSameMonth(day, currentMonth)

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(day)}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-colors active:scale-95 ${
                isSelected ? 'bg-primary' : isToday ? 'bg-primary/20' : 'active:bg-surface2'
              } ${!inMonth ? 'opacity-30' : ''}`}
            >
              <span className={`text-sm font-medium ${
                isSelected ? 'text-white' : isToday ? 'text-primary' : 'text-white'
              }`}>
                {format(day, 'd')}
              </span>
              <div className="flex gap-0.5 mt-0.5">
                {hasCompleted && <div className="w-1.5 h-1.5 rounded-full bg-success" />}
                {hasScheduled && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected day sessions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">
            {format(selectedDay, 'EEEE, MMM d')}
          </h2>
          <button
            onClick={() => navigate(`/sessions/new?date=${format(selectedDay, 'yyyy-MM-dd')}`)}
            className="text-primary text-sm font-medium active:scale-95 transition-transform"
          >
            + Add
          </button>
        </div>

        {selectedDaySessions.length > 0 ? (
          selectedDaySessions.map((session) => (
            <button
              key={session.id}
              onClick={() => navigate(`/sessions/${session.id}`)}
              className="w-full bg-surface border border-border rounded-xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                session.isCompleted ? 'bg-success/20' : 'bg-primary/20'
              }`}>
                {session.isCompleted
                  ? <CheckCircle2 className="w-4 h-4 text-success" />
                  : <Clock className="w-4 h-4 text-primary" />
                }
              </div>
              <p className="flex-1 font-medium text-white truncate">
                {session.templateName ?? 'Custom Workout'}
              </p>
              <Badge variant={session.isCompleted ? 'success' : 'primary'}>
                {session.isCompleted ? 'Done' : 'Active'}
              </Badge>
            </button>
          ))
        ) : (
          <div className="bg-surface border border-border rounded-xl p-4 text-center">
            <p className="text-text-secondary text-sm">No sessions scheduled</p>
          </div>
        )}
      </div>
    </div>
  )
}
