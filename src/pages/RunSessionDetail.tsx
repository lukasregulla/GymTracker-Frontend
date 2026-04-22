import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, Activity, MapPin, Clock, Zap, FileText, CalendarClock, Loader2 } from 'lucide-react'
import { useRunSession, useCompleteRunSession } from '@/hooks/useRunSessions'
import { SkeletonCard } from '@/components/SkeletonCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const RUN_TYPES = ['Easy', 'Tempo', 'Long', 'Interval', 'Recovery', 'Race']

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
  const runId = Number(id)
  const { data: run, isLoading, isError } = useRunSession(runId)
  const completeRun = useCompleteRunSession(runId)

  const [showCompleteForm, setShowCompleteForm] = useState(false)
  const [distanceKm, setDistanceKm] = useState('')
  const [durationMins, setDurationMins] = useState('')
  const [durationSecs, setDurationSecs] = useState('')
  const [runType, setRunType] = useState('')
  const [notes, setNotes] = useState('')

  const openCompleteForm = () => {
    setRunType(run?.runType ?? '')
    setNotes(run?.notes ?? '')
    setDistanceKm('')
    setDurationMins('')
    setDurationSecs('')
    setShowCompleteForm(true)
  }

  const totalSeconds =
    parseInt(durationMins || '0', 10) * 60 + parseInt(durationSecs || '0', 10)
  const canSave =
    !!distanceKm && parseFloat(distanceKm) > 0 && totalSeconds > 0 && !completeRun.isPending

  const handleSave = () => {
    if (!canSave) return
    completeRun.mutate(
      {
        distanceKm: parseFloat(distanceKm),
        durationSeconds: totalSeconds,
        runType: runType || null,
        notes: notes.trim() || null,
      },
      { onSuccess: () => setShowCompleteForm(false) }
    )
  }

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
        {run?.isCompleted && run.runType && <Badge variant="primary">{run.runType}</Badge>}
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
        run.isCompleted ? (
          <>
            <div className="grid grid-cols-2 gap-3 animate-scaleIn">
              {run.distanceKm != null && (
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-text-secondary text-xs">Distance</span>
                  </div>
                  <p className="text-white text-2xl font-bold">{run.distanceKm}</p>
                  <p className="text-text-secondary text-xs">km</p>
                </div>
              )}

              {run.durationSeconds != null && (
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
              )}

              {run.averagePaceSecondsPerKm != null && (
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
              )}

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
          </>
        ) : (
          <>
            <div className="bg-surface border border-border rounded-xl p-5 animate-scaleIn space-y-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-primary" />
                <span className="text-text-secondary text-sm font-medium">Scheduled run</span>
              </div>
              {run.scheduledDate && (
                <p className="text-white text-lg font-semibold">
                  {format(parseISO(run.scheduledDate), 'EEEE, MMM d yyyy')}
                </p>
              )}
              {run.distanceKm != null && (
                <p className="text-text-secondary text-sm">
                  Estimated distance: <span className="text-white">{run.distanceKm} km</span>
                </p>
              )}
              {run.runType && (
                <div>
                  <Badge variant="primary">{run.runType}</Badge>
                </div>
              )}
              {run.notes && (
                <div className="pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary text-xs">Notes</span>
                  </div>
                  <p className="text-white text-sm">{run.notes}</p>
                </div>
              )}
            </div>

            {showCompleteForm ? (
              <div className="bg-surface border border-border rounded-xl p-5 space-y-4 animate-scaleIn">
                <p className="text-white font-semibold">Complete run</p>

                <div className="space-y-2">
                  <label className="text-text-secondary text-sm">Distance (km)</label>
                  <Input
                    inputMode="decimal"
                    placeholder="0.0"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-text-secondary text-sm">Duration</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        inputMode="numeric"
                        placeholder="0"
                        value={durationMins}
                        onChange={(e) => setDurationMins(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <span className="text-text-secondary shrink-0">min</span>
                    <div className="w-20">
                      <Input
                        inputMode="numeric"
                        placeholder="00"
                        value={durationSecs}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '')
                          if (parseInt(v || '0', 10) <= 59) setDurationSecs(v)
                        }}
                      />
                    </div>
                    <span className="text-text-secondary shrink-0">sec</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-text-secondary text-sm">Run type (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {RUN_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setRunType(runType === type ? '' : type)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium active:scale-95 transition-transform ${
                          runType === type
                            ? 'bg-primary text-white'
                            : 'bg-surface2 border border-border text-text-secondary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-text-secondary text-sm">Notes (optional)</label>
                  <Input
                    placeholder="How did it go?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={handleSave} disabled={!canSave}>
                  {completeRun.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </Button>
                <button
                  type="button"
                  onClick={() => setShowCompleteForm(false)}
                  className="w-full py-2 text-text-secondary text-sm active:scale-95 transition-transform"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <Button className="w-full" onClick={openCompleteForm}>
                Complete Run
              </Button>
            )}
          </>
        )
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <p className="text-text-secondary">Run not found</p>
        </div>
      )}
    </div>
  )
}
