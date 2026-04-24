import { useNavigate, useSearchParams } from 'react-router-dom'
import { Dumbbell, Activity } from 'lucide-react'

export default function LogChoice() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const date = searchParams.get('date')
  const dateSuffix = date ? `?date=${date}` : ''

  return (
    <div className="px-4 pt-6 space-y-4">
      <h1 className="text-xl font-bold text-white">New Session</h1>

      <button
        type="button"
        onClick={() => navigate(`/sessions/new${dateSuffix}`)}
        className="w-full bg-surface border border-border rounded-xl p-6 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
      >
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Dumbbell className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-white text-lg">Strength Session</p>
          <p className="text-text-secondary text-sm">Log sets and weights</p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => navigate(`/runs/choose${dateSuffix}`)}
        className="w-full bg-surface border border-border rounded-xl p-6 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
      >
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-white text-lg">Run</p>
          <p className="text-text-secondary text-sm">Log distance and time</p>
        </div>
      </button>
    </div>
  )
}
