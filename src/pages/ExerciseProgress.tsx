import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, Trophy, TrendingUp, Calendar } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Dot
} from 'recharts'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/SkeletonCard'
import { useExerciseProgress } from '@/hooks/useExercises'
import type { ProgressPointDto } from '@/types'

interface CustomDotProps {
  cx?: number
  cy?: number
  payload?: ProgressPointDto
  maxWeight?: number
}

function CustomDot({ cx, cy, payload, maxWeight }: CustomDotProps) {
  if (!cx || !cy || !payload) return null
  const isPb = payload.bestWeight === maxWeight
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={isPb ? 6 : 4}
      fill={isPb ? '#FF6B35' : '#888888'}
      stroke={isPb ? '#FF6B35' : '#888888'}
      strokeWidth={2}
    />
  )
}

interface TooltipPayload {
  payload?: ProgressPointDto
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length || !payload[0].payload) return null
  const d = payload[0].payload
  return (
    <div className="bg-surface2 border border-border rounded-lg px-3 py-2">
      <p className="text-white font-bold">{d.bestWeight}kg</p>
      <p className="text-text-secondary text-xs">{format(parseISO(d.date), 'MMM d, yyyy')}</p>
      <p className="text-text-secondary text-xs">{d.totalSets} sets · {d.totalReps} reps</p>
    </div>
  )
}

export default function ExerciseProgress() {
  const { id } = useParams<{ id: string }>()
  const exerciseId = Number(id)
  const navigate = useNavigate()

  const { data: progress, isLoading, isError } = useExerciseProgress(exerciseId)

  if (isLoading) {
    return (
      <div className="px-4 pt-6 space-y-4">
        <SkeletonCard className="h-16" />
        <SkeletonCard className="h-64" />
      </div>
    )
  }

  if (isError || !progress) {
    return (
      <div className="px-4 pt-6 text-center">
        <p className="text-text-secondary">Could not load progress.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/exercises')}>Back</Button>
      </div>
    )
  }

  const maxWeight = Math.max(...(progress.history.map((p) => p.bestWeight)), 0)
  const lastEntry = progress.history[progress.history.length - 1]

  const chartData = progress.history.map((p) => ({
    ...p,
    date: p.date,
    label: format(parseISO(p.date), 'MMM d'),
  }))

  return (
    <div className="px-4 pt-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white truncate">{progress.exerciseName}</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-border rounded-xl p-3 text-center">
          <Trophy className="w-4 h-4 text-primary mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{progress.personalBest > 0 ? `${progress.personalBest}kg` : '—'}</p>
          <p className="text-text-secondary text-xs">Personal Best</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-3 text-center">
          <TrendingUp className="w-4 h-4 text-success mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{progress.history.length}</p>
          <p className="text-text-secondary text-xs">Sessions</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-3 text-center">
          <Calendar className="w-4 h-4 text-text-secondary mx-auto mb-1" />
          <p className="text-white font-bold text-sm">
            {lastEntry ? format(parseISO(lastEntry.date), 'MMM d') : '—'}
          </p>
          <p className="text-text-secondary text-xs">Last Logged</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 1 ? (
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-white font-semibold mb-4">Progress</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#888888', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#888888', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit="kg"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="bestWeight"
                stroke="#FF6B35"
                strokeWidth={2}
                dot={(props) => <CustomDot {...props} maxWeight={maxWeight} />}
                activeDot={{ r: 6, fill: '#FF6B35' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : chartData.length === 1 ? (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <p className="text-text-secondary">Only one session logged — keep going to see a trend!</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <p className="text-text-secondary">No sessions logged yet for this exercise.</p>
        </div>
      )}
    </div>
  )
}
