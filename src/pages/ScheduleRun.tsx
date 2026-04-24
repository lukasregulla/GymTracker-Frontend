import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useScheduleRunSession } from '@/hooks/useRunSessions'

const RUN_TYPES = ['Easy', 'Tempo', 'Long', 'Interval', 'Recovery', 'Race']

export default function ScheduleRun() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [scheduledDate, setScheduledDate] = useState(
    searchParams.get('date') ?? format(new Date(), 'yyyy-MM-dd')
  )
  const [name, setName] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [runType, setRunType] = useState('')
  const [notes, setNotes] = useState('')

  const scheduleRun = useScheduleRunSession()

  const canSubmit = !!scheduledDate && !scheduleRun.isPending

  const handleSubmit = () => {
    if (!canSubmit) return
    scheduleRun.mutate(
      {
        scheduledDate,
        name: name.trim() || null,
        distanceKm: distanceKm ? parseFloat(distanceKm) : null,
        runType: runType || null,
        notes: notes.trim() || undefined,
      },
      { onSuccess: (run) => navigate(`/runs/${run.id}`) }
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
        <h1 className="text-xl font-bold text-white">Schedule Run</h1>
      </div>

      <div className="space-y-2">
        <label className="text-text-secondary text-sm">Scheduled date</label>
        <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="text-text-secondary text-sm">Name (optional)</label>
        <Input
          placeholder="e.g. Sunday long run"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 100))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-text-secondary text-sm">Estimated distance (km) — optional</label>
        <Input
          inputMode="decimal"
          placeholder="0.0"
          value={distanceKm}
          onChange={(e) => setDistanceKm(e.target.value)}
        />
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
          placeholder="e.g. Target 5:30/km pace"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit}>
        {scheduleRun.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Schedule Run'}
      </Button>
    </div>
  )
}
