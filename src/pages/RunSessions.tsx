import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { Plus, Activity, ChevronRight } from 'lucide-react'
import { useRunSessions } from '@/hooks/useRunSessions'
import { SkeletonCard } from '@/components/SkeletonCard'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function RunSessions() {
  const navigate = useNavigate()
  const { data: runs, isLoading } = useRunSessions()

  return (
    <div className="px-4 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">My Runs</h1>
        <button
          type="button"
          onClick={() => navigate('/runs/new')}
          aria-label="Log a run"
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : runs && runs.length > 0 ? (
        <div className="space-y-3">
          {runs.map((run) => {
            const title =
              run.name ??
              (run.distanceKm != null ? `${run.distanceKm}km Run` : 'Scheduled Run')

            const meta = [
              run.distanceKm != null ? `${run.distanceKm}km` : null,
              run.durationSeconds != null ? formatDuration(run.durationSeconds) : null,
              run.runType || null,
            ]
              .filter(Boolean)
              .join(' · ')

            return (
              <button
                key={run.id}
                onClick={() => navigate(`/runs/${run.id}`)}
                className="w-full bg-surface border border-border rounded-xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform animate-scaleIn"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{title}</p>

                  {meta ? (
                    <p className="text-text-secondary text-sm">{meta}</p>
                  ) : (
                    <p className="text-text-secondary text-sm">Scheduled run</p>
                  )}

                  {run.scheduledDate && (
                    <p className="text-text-secondary text-xs">
                      {format(parseISO(run.scheduledDate), 'EEE, MMM d')}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
              </button>
            )
          })}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <Activity className="w-8 h-8 text-text-secondary mx-auto mb-2" />
          <p className="text-text-secondary">No runs yet</p>
          <p className="text-text-secondary text-sm mt-1">Tap + to log your first run</p>
        </div>
      )}
    </div>
  )
}