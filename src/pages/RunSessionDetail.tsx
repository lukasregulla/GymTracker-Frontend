import { useNavigate, useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, Activity, MapPin, Clock, Zap, FileText } from 'lucide-react'
import { useRunSession } from '@/hooks/useRunSessions'
import { SkeletonCard } from '@/components/SkeletonCard'
import { Badge } from '@/components/ui/badge'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatPace(paceSeconds: number): string {
  const paceMin = Math.floor(paceSeconds / 60)
  const paceSec = Math.round(paceSeconds % 60)
  return `${paceMin}:${String(paceSec).padStart(2, '0')} /km`
}

export default function RunSessionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: run, isLoading, isError } = useRunSession(Number(id))

  return (
    <div className="px-4 pt-6 space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="h-6 bg-surface2 rounded animate-shimmer w-40" />
          ) : (
            <>
              <h1 className="text-xl font-bold text-white truncate">
                {run?.name ?? 'Run'}
              </h1>
              {run?.scheduledDate && (
                <p className="text-text-secondary text-sm">
                  {format(parseISO(run.scheduledDate), 'EEE, MMM d yyyy')}
                </p>
              )}
            </>
          )}
        </div>
        {run?.runType && <Badge variant="primary">{run.runType}</Badge>}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <SkeletonCard className="h-36" />
          <SkeletonCard className="h-20" />
        </div>
      ) : isError ? (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <p className="text-danger">Could not load run</p>
          <p className="text-text-secondary text-sm mt-1">Check your connection and try again</p>
        </div>
      ) : run ? (
        <>
          <div className="grid grid-cols-2 gap-3 animate-scaleIn">
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-text-secondary text-xs">Distance</span>
              </div>
              <p className="text-white text-2xl font-bold">{run.distanceKm}</p>
              <p className="text-text-secondary text-xs">km</p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-text-secondary text-xs">Duration</span>
              </div>
              <p className="text-white text-2xl font-bold">
                {formatDuration(run.durationSeconds)}
              </p>
              <p className="text-text-secondary text-xs">min:sec</p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-text-secondary text-xs">Pace</span>
              </div>
              <p className="text-white text-xl font-bold">
                {formatPace(run.averagePaceSecondsPerKm)}
              </p>
              <p className="text-text-secondary text-xs">per km</p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-text-secondary text-xs">Type</span>
              </div>
              <p className="text-white text-xl font-bold">{run.runType ?? '—'}</p>
            </div>
          </div>

          {run.notes && (
            <div className="bg-surface border border-border rounded-xl p-4 animate-scaleIn">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-text-secondary" />
                <span className="text-text-secondary text-sm">Notes</span>
              </div>
              <p className="text-white text-sm">{run.notes}</p>
            </div>
          )}

          {run.scheduledDate && (
            <p className="text-text-secondary text-xs text-center">
              {format(parseISO(run.scheduledDate), 'MMM d, yyyy')}
            </p>
          )}
        </>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <p className="text-text-secondary">Run not found</p>
        </div>
      )}
    </div>
  )
}
