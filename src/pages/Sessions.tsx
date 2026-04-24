import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { Plus, Dumbbell, ChevronRight } from 'lucide-react'
import { useSessions } from '@/hooks/useSessions'
import { SkeletonCard } from '@/components/SkeletonCard'


export default function Sessions() {
  const navigate = useNavigate()
  const { data: sessions, isLoading } = useSessions()
  const Sessions = sessions?.filter(s => s.sessionType !== 'Run') ?? []

  return (
    
    <div className="px-4 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">My Workouts</h1>
        <button
          type="button"
          onClick={() => navigate('/sessions/new')}
          aria-label="Log a workout"
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : sessions && Sessions.length > 0 ? (
        <div className="space-y-3">
          {Sessions.map((session) => {
            const title = session.name ?? session.templateName ?? 'Ad-hoc Session'

            const dateStr = session.completedAt
              ? format(parseISO(session.completedAt), 'EEE, MMM d')
              : session.scheduledDate
              ? format(parseISO(session.scheduledDate), 'EEE, MMM d')
              : null

            const meta = [
              session.templateName && !session.name ? session.templateName : null,
              session.isCompleted ? 'Completed' : 'In progress',
            ]
              .filter(Boolean)
              .join(' · ')

            return (
              <button
                key={session.id}
                type="button"
                onClick={() => navigate(`/sessions/${session.id}`)}
                className="w-full bg-surface border border-border rounded-xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform animate-scaleIn"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{title}</p>
                  <p className="text-text-secondary text-sm">{meta}</p>
                  {dateStr && (
                    <p className="text-text-secondary text-xs">{dateStr}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
              </button>
            )
          })}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <Dumbbell className="w-8 h-8 text-text-secondary mx-auto mb-2" />
          <p className="text-text-secondary">No workouts yet</p>
          <p className="text-text-secondary text-sm mt-1">Tap + to log your first workout</p>
        </div>
      )}
    </div>
  )
}
