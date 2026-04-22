import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ChevronRight, CheckCircle2, Clock, User, Activity } from 'lucide-react'
import { useDashboardWeek, useDashboardRecent } from '@/hooks/useDashboard'
import { useRunSessions } from '@/hooks/useRunSessions'
import { SkeletonCard } from '@/components/SkeletonCard'
import { Badge } from '@/components/ui/badge'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: week, isLoading: weekLoading } = useDashboardWeek()
  const { data: recent, isLoading: recentLoading } = useDashboardRecent(5)
  const { data: allRuns, isLoading: runsLoading } = useRunSessions()
  const recentRuns = allRuns?.slice().sort((a, b) => b.id - a.id).slice(0, 3)

  const username = localStorage.getItem('gym_username') ?? 'Athlete'

  return (
    <div className="px-4 pt-6 space-y-6">
      <div>
        <p className="text-text-secondary text-sm">Welcome back,</p>
        <h1 className="text-2xl font-bold text-white">{username}</h1>
      </div>

      <button
          onClick={() => navigate('/profile')}
          aria-label="Go to profile"
          className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center active:scale-95 transition-transform"
        >
          <User className="w-5 h-5 text-white" />
        </button>

      {/* Week summary */}
      {weekLoading ? (
        <SkeletonCard className="h-36" />
      ) : week ? (
        <div className="bg-surface border border-border rounded-xl p-4 animate-scaleIn">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">This Week</h2>
            <span className="text-primary font-bold text-lg">
              {week.totalCompleted}/{week.totalScheduled}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-surface2 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width: week.totalScheduled > 0
                  ? `${(week.totalCompleted / week.totalScheduled) * 100}%`
                  : '0%',
              }}
            />
          </div>

          {/* Day strip */}
          <div className="flex justify-between">
            {DAY_LABELS.map((day, i) => {
              const weekStart = parseISO(week.weekStart)
              const dayDate = new Date(weekStart)
              dayDate.setDate(weekStart.getDate() + i)
              const dayStr = format(dayDate, 'yyyy-MM-dd')
              const session = week.sessions.find(
                (s) => s.scheduledDate && s.scheduledDate.startsWith(dayStr)
              )
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-text-secondary">{day}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                      session
                        ? session.isCompleted
                          ? 'bg-success/20 text-success'
                          : 'bg-primary/20 text-primary'
                        : 'bg-surface2 text-text-secondary'
                    }`}
                  >
                    {dayDate.getDate()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* Recent sessions */}
      <div>
        <h2 className="font-semibold text-white mb-3">Recent Sessions</h2>
        {recentLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : recent && recent.length > 0 ? (
          <div className="space-y-3">
            {recent.map((session) => (
              <button
                key={session.id}
                onClick={() => navigate(
                  session.sessionType === 'Run'
                    ? `/runs/${session.id}`
                    : `/sessions/${session.id}`
                )}
                className="w-full bg-surface border border-border rounded-xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform animate-scaleIn"
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
                    {session.templateName ?? 'Custom Workout'}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {session.scheduledDate
                      ? format(parseISO(session.scheduledDate), 'EEE, MMM d')
                      : 'No date set'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={session.isCompleted ? 'success' : 'primary'}>
                    {session.isCompleted ? 'Done' : 'Active'}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <p className="text-text-secondary">No recent sessions</p>
            <p className="text-text-secondary text-sm mt-1">Tap + to start a workout</p>
          </div>
        )}
      </div>

      {/* Recent runs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white">Recent Runs</h2>
          <button
            onClick={() => navigate('/runs')}
            className="text-primary text-sm active:opacity-70 transition-opacity"
          >
            See all
          </button>
        </div>
        {runsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : recentRuns && recentRuns.length > 0 ? (
          <div className="space-y-3">
            {recentRuns.map((run) => (
              <button
                key={run.id}
                onClick={() => navigate(`/runs/${run.id}`)}
                className="w-full bg-surface border border-border rounded-xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform animate-scaleIn"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {run.name ?? `${run.distanceKm}km Run`}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {run.distanceKm}km
                    {run.scheduledDate
                      ? ` · ${format(parseISO(run.scheduledDate), 'EEE, MMM d')}`
                      : ''}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <p className="text-text-secondary">No runs yet</p>
            <p className="text-text-secondary text-sm mt-1">Tap + to log a run</p>
          </div>
        )}
      </div>
    </div>
  )
}
