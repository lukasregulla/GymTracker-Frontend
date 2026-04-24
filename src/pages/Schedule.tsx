import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, startOfWeek, addDays, parseISO, isSameDay } from 'date-fns'
import { Plus, CheckCircle2, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSessions } from '@/hooks/useSessions'
import { SkeletonCard } from '@/components/SkeletonCard'
import { Badge } from '@/components/ui/badge'

export default function Schedule() {
  const navigate = useNavigate()
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState(new Date())

  const weekStart = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset * 7)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const from = format(weekStart, 'yyyy-MM-dd')
  const to = format(addDays(weekStart, 6), 'yyyy-MM-dd')

  const { data: sessions, isLoading } = useSessions(from, to)

  const selectedDaySessions = sessions?.filter((s) =>
    s.scheduledDate && isSameDay(parseISO(s.scheduledDate), selectedDay)
  ) ?? []

  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Schedule</h1>
        <button
          onClick={() => navigate(`/log?date=${format(selectedDay, 'yyyy-MM-dd')}`)}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Week navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="w-8 h-8 flex items-center justify-center text-text-secondary active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <p className="flex-1 text-center text-sm text-text-secondary">
          {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </p>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="w-8 h-8 flex items-center justify-center text-text-secondary active:scale-95 transition-transform"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day strip */}
      <div className="flex gap-1 bg-surface border border-border rounded-xl p-2">
        {weekDays.map((day) => {
          const hasSessions = sessions?.some(
            (s) => s.scheduledDate && isSameDay(parseISO(s.scheduledDate), day)
          )
          const isSelected = isSameDay(day, selectedDay)
          const isToday = isSameDay(day, new Date())

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-colors active:scale-95 ${
                isSelected ? 'bg-primary' : 'active:bg-surface2'
              }`}
            >
              <span className={`text-[10px] font-medium ${isSelected ? 'text-white' : 'text-text-secondary'}`}>
                {format(day, 'EEE')[0]}
              </span>
              <span className={`text-sm font-bold ${isSelected ? 'text-white' : isToday ? 'text-primary' : 'text-white'}`}>
                {format(day, 'd')}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full ${
                hasSessions ? (isSelected ? 'bg-white' : 'bg-primary') : 'transparent'
              }`} />
            </button>
          )
        })}
      </div>

      {/* Sessions for selected day */}
      <div className="space-y-2">
        <h2 className="font-semibold text-white">
          {format(selectedDay, 'EEEE, MMMM d')}
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : selectedDaySessions.length > 0 ? (
          selectedDaySessions.map((session) => (
            <button
              key={session.id}
              onClick={() => navigate(
                session.sessionType === 'Run'
                  ? `/runs/${session.id}`
                  : `/sessions/${session.id}`
              )}
              className="w-full bg-surface border border-border rounded-xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                session.isCompleted ? 'bg-success/20' : 'bg-primary/20'
              }`}>
                {session.isCompleted
                  ? <CheckCircle2 className="w-5 h-5 text-success" />
                  : <Clock className="w-5 h-5 text-primary" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {session.name ?? session.templateName ?? 'Custom Workout'}
                </p>
              </div>
              <Badge variant={session.isCompleted ? 'success' : 'primary'}>
                {session.isCompleted ? 'Done' : 'Active'}
              </Badge>
            </button>
          ))
        ) : (
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <p className="text-text-secondary">No sessions scheduled</p>
            <button
              onClick={() => navigate(`/log?date=${format(selectedDay, 'yyyy-MM-dd')}`)}
              className="text-primary text-sm font-medium mt-2 active:scale-95 transition-transform"
            >
              + Add session
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
