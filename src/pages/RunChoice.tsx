import { useNavigate, useSearchParams } from 'react-router-dom'
import { Activity, CalendarPlus, ArrowLeft } from 'lucide-react'

export default function RunChoice() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const date = searchParams.get('date')
  const dateSuffix = date ? `?date=${date}` : ''

  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">Run</h1>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/runs/new${dateSuffix}`)}
        className="w-full bg-surface border border-border rounded-xl p-6 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
      >
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-white text-lg">Log Run</p>
          <p className="text-text-secondary text-sm">Record a completed run</p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => navigate(`/runs/schedule${dateSuffix}`)}
        className="w-full bg-surface border border-border rounded-xl p-6 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
      >
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <CalendarPlus className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-white text-lg">Schedule Run</p>
          <p className="text-text-secondary text-sm">Plan a future run</p>
        </div>
      </button>
    </div>
  )
}
