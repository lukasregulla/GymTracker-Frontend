import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateRunSession } from '@/hooks/useRunSessions'

const RUN_TYPES = ['Easy', 'Tempo', 'Long', 'Interval', 'Recovery', 'Race']

export default function NewRunSession() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [date, setDate] = useState(searchParams.get('date') ?? format(new Date(), 'yyyy-MM-dd'))
  const [name, setName] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [durationMins, setDurationMins] = useState('')
  const [durationSecs, setDurationSecs] = useState('')
  const [runType, setRunType] = useState('')
  const [notes, setNotes] = useState('')

  const createRun = useCreateRunSession()

  const totalSeconds =
    parseInt(durationMins || '0', 10) * 60 + parseInt(durationSecs || '0', 10)
  const canSubmit =
    !!distanceKm && parseFloat(distanceKm) > 0 && totalSeconds > 0 && !createRun.isPending

  const handleCreate = () => {
    if (!canSubmit) return
    createRun.mutate(
      {
        name: name.trim() || null,
        scheduledDate: date || null,
        notes: notes.trim() || undefined,
        distanceKm: parseFloat(distanceKm),
        durationSeconds: totalSeconds,
        runType: runType || undefined,
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
        <h1 className="text-xl font-bold text-white">Log Run</h1>
      </div>

      <div className="space-y-2">
        <label className="text-text-secondary text-sm">Date</label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="text-text-secondary text-sm">Name (optional)</label>
        <Input
          placeholder="e.g. Morning 5K"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 100))}
        />
      </div>

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
          placeholder="e.g. Felt great, sunny morning"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button className="w-full" onClick={handleCreate} disabled={!canSubmit}>
        {createRun.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Run'}
      </Button>
    </div>
  )
}
