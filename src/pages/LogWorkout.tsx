import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, Plus, Loader2, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { SkeletonCard } from '@/components/SkeletonCard'
import { useSession, useCompleteSession, useRemoveSessionExercise, useAddSessionExercise } from '@/hooks/useSessions'
import { useLogSet, useDeleteSet } from '@/hooks/useSets'
import { useExercises } from '@/hooks/useExercises'
import type { SessionExerciseDto, SetDto } from '@/types'

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio']

export default function LogWorkout() {
  const { id } = useParams<{ id: string }>()
  const sessionId = Number(id)
  const navigate = useNavigate()

  const { data: session, isLoading, isError } = useSession(sessionId)
  const completeSession = useCompleteSession()
  const removeExercise = useRemoveSessionExercise(sessionId)
  const addExercise = useAddSessionExercise(sessionId)
  const { data: allExercises } = useExercises()

  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [removeExId, setRemoveExId] = useState<number | null>(null)
  const [addExOpen, setAddExOpen] = useState(false)
  const [exSearch, setExSearch] = useState('')
  const [exMuscleFilter, setExMuscleFilter] = useState('All')
  if (isLoading) {
    return (
      <div className="px-4 pt-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-surface2 animate-pulse" />
          <div className="h-5 w-40 bg-surface2 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (isError || !session) {
    return (
      <div className="px-4 pt-6 text-center">
        <p className="text-text-secondary">Session not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    )
  }

  const handleComplete = () => {
    completeSession.mutate(sessionId, {
      onSuccess: () => navigate('/'),
    })
  }

  const handleRemoveExercise = () => {
    if (removeExId === null) return
    removeExercise.mutate(removeExId, {
      onSuccess: () => setRemoveExId(null),
    })
  }

  const handleAddExercise = (exerciseId: number) => {
    const orderIndex = session.exercises.length
    addExercise.mutate(
      { exerciseId, orderIndex },
      {
        onSuccess: () => {
          setAddExOpen(false)
          setExSearch('')
        },
      }
    )
  }

  // Filter out exercises already in this session
  const existingExerciseIds = new Set(session.exercises.map((e) => e.exerciseId))
  const filteredExercises = allExercises?.filter(
    (ex) =>
      ex.name.toLowerCase().includes(exSearch.toLowerCase()) &&
      (exMuscleFilter === 'All' || ex.muscleGroup === exMuscleFilter) &&
      !existingExerciseIds.has(ex.id)
  ) ?? []

  const sortedExercises = [...session.exercises].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">
            {session.name ?? session.templateName ?? 'Ad-hoc Session'}
          </p>
          {session.scheduledDate && (
            <p className="text-text-secondary text-xs">
              {format(parseISO(session.scheduledDate), 'EEE, MMM d')}
            </p>
          )}
        </div>
        {!session.isCompleted && (
          <Button size="sm" onClick={() => setCompleteOpen(true)} className="shrink-0">
            Complete
          </Button>
        )}
        {session.isCompleted && (
          <Badge variant="success">Completed</Badge>
        )}
      </div>

      {/* Exercise list */}
      <div className="px-4 py-4 space-y-3">
        {sortedExercises.length === 0 && (
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <p className="text-text-secondary">No exercises yet.</p>
            <p className="text-text-secondary text-sm mt-1">Tap "Add Exercise" below to get started.</p>
          </div>
        )}

        {sortedExercises.map((ex) => (
          <ExerciseCard
            key={ex.sessionExerciseId}
            exercise={ex}
            sessionId={sessionId}
            expanded={expandedId === ex.sessionExerciseId}
            onToggle={() =>
              setExpandedId(expandedId === ex.sessionExerciseId ? null : ex.sessionExerciseId)
            }
            onRemove={() => setRemoveExId(ex.sessionExerciseId)}
            disabled={session.isCompleted}
          />
        ))}

        {/* Add exercise button */}
        {!session.isCompleted && (
          <button
            type="button"
            onClick={() => setAddExOpen(true)}
            className="w-full border border-dashed border-border rounded-xl py-4 flex items-center justify-center gap-2 text-text-secondary active:bg-surface2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Exercise</span>
          </button>
        )}
      </div>

      {/* Complete workout button */}
      {!session.isCompleted && (
        <div className="px-4 pb-6">
          <Button
            className="w-full h-14 text-base font-semibold active:scale-[0.98] transition-transform"
            onClick={() => setCompleteOpen(true)}
          >
            Complete Workout
          </Button>
        </div>
      )}

      {/* Add exercise sheet */}
      <Sheet
        open={addExOpen}
        onOpenChange={(open) => {
          setAddExOpen(open)
          if (!open) { setExSearch(''); setExMuscleFilter('All') }
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Exercise</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input
                placeholder="Search exercises..."
                value={exSearch}
                onChange={(e) => setExSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
              {MUSCLE_GROUPS.map((mg) => (
                <button
                  key={mg}
                  type="button"
                  onClick={() => setExMuscleFilter(mg)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors active:scale-95 ${
                    exMuscleFilter === mg
                      ? 'bg-primary text-white'
                      : 'bg-surface2 text-text-secondary border border-border'
                  }`}
                >
                  {mg}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredExercises.length === 0 && (
                <p className="text-text-secondary text-sm text-center py-4">
                  {allExercises?.length === 0
                    ? 'No exercises in your library yet.'
                    : 'No exercises match your search.'}
                </p>
              )}
              {filteredExercises.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleAddExercise(ex.id)}
                  disabled={addExercise.isPending}
                  className="w-full bg-surface2 border border-border rounded-xl p-3 text-left active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  <p className="font-medium text-white">{ex.name}</p>
                  <p className="text-text-secondary text-sm">{ex.muscleGroup}</p>
                </button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Complete confirmation */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Workout?</DialogTitle>
            <DialogDescription>
              Mark this session as complete. You won't be able to add more sets.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>Cancel</Button>
            <Button onClick={handleComplete} disabled={completeSession.isPending}>
              {completeSession.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove exercise confirm */}
      <Dialog open={removeExId !== null} onOpenChange={(open) => !open && setRemoveExId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Exercise?</DialogTitle>
            <DialogDescription>
              Remove this exercise and all its sets from this session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveExId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleRemoveExercise} disabled={removeExercise.isPending}>
              {removeExercise.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── ExerciseCard ────────────────────────────────────────────────────────────

interface ExerciseCardProps {
  exercise: SessionExerciseDto
  sessionId: number
  expanded: boolean
  onToggle: () => void
  onRemove: () => void
  disabled: boolean
}

function ExerciseCard({
  exercise,
  sessionId,
  expanded,
  onToggle,
  onRemove,
  disabled,
}: ExerciseCardProps) {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [flashSetId, setFlashSetId] = useState<number | null>(null)
  const [pbSetId, setPbSetId] = useState<number | null>(null)
  const weightRef = useRef<HTMLInputElement>(null)

  // Each ExerciseCard gets its own logSet/deleteSet bound to sessionId
  const logSet = useLogSet(sessionId)
  const deleteSet = useDeleteSet(sessionId)

  const nextSetNumber =
    exercise.sets.length > 0
      ? Math.max(...exercise.sets.map((s) => s.setNumber)) + 1
      : 1

  const handleLog = () => {
    const w = parseFloat(weight)
    const r = parseInt(reps, 10)
    if (isNaN(w) || w <= 0 || isNaN(r) || r <= 0) return

    // Use sessionExerciseId (NOT exerciseId) in the URL
    logSet.mutate(
      {
        sessionExerciseId: exercise.sessionExerciseId,
        weightKg: w,
        reps: r,
        setNumber: nextSetNumber,
      },
      {
        onSuccess: (newSet) => {
          setWeight('')
          setReps('')
          weightRef.current?.focus()

          setFlashSetId(newSet.id)
          setTimeout(() => setFlashSetId(null), 700)

          if (newSet.isPersonalBest) {
            setPbSetId(newSet.id)
            setTimeout(() => setPbSetId(null), 500)
          }
        },
      }
    )
  }

  const sortedSets = [...exercise.sets].sort((a, b) => a.setNumber - b.setNumber)

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden animate-scaleIn">
      {/* Exercise header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate">{exercise.exerciseName}</h3>
            {exercise.muscleGroup && (
              <p className="text-text-secondary text-sm">{exercise.muscleGroup}</p>
            )}
          </div>
          {!disabled && (
            <button
              type="button"
              aria-label="Remove exercise"
              onClick={onRemove}
              className="w-8 h-8 flex items-center justify-center text-text-secondary active:scale-95 transition-transform ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Logged sets */}
        {sortedSets.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {sortedSets.map((set) => (
              <SetRow
                key={set.id}
                set={set}
                isFlashing={flashSetId === set.id}
                isPbPulsing={pbSetId === set.id}
                onDelete={() =>
                  deleteSet.mutate({
                    sessionExerciseId: exercise.sessionExerciseId,
                    setId: set.id,
                  })
                }
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add set — collapsed button or expanded form */}
      {!disabled && (
        <>
          {!expanded ? (
            <button
              onClick={onToggle}
              className="w-full border-t border-border px-4 py-3 flex items-center gap-2 text-primary text-sm font-medium active:bg-surface2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add set
            </button>
          ) : (
            <div className="border-t border-border p-4 space-y-3 bg-surface2/50">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    ref={weightRef}
                    inputMode="decimal"
                    placeholder="kg"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="text-center text-lg font-semibold"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    inputMode="numeric"
                    placeholder="reps"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLog()}
                    className="text-center text-lg font-semibold"
                  />
                </div>
              </div>
              <Button
                className="w-full active:scale-[0.98]"
                onClick={handleLog}
                disabled={logSet.isPending || !weight || !reps}
              >
                {logSet.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  `Log Set ${nextSetNumber}`
                )}
              </Button>
              <button
                type="button"
                onClick={onToggle}
                className="w-full text-text-secondary text-sm py-1 active:scale-95 transition-transform"
              >
                Done
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── SetRow ──────────────────────────────────────────────────────────────────

interface SetRowProps {
  set: SetDto
  isFlashing: boolean
  isPbPulsing: boolean
  onDelete: () => void
  disabled: boolean
}

function SetRow({ set, isFlashing, isPbPulsing, onDelete, disabled }: SetRowProps) {
  return (
  <div
    className={`flex items-center rounded-lg px-3 py-2 ${
      isFlashing ? 'animate-flash' : ''
    }`}
  >
    <span className="text-text-secondary text-sm w-14">
      Set {set.setNumber}
    </span>

    <span className="text-white font-medium flex-1 text-right pr-2">
      {set.weightKg}kg × {set.reps}
    </span>

    <div className="flex items-center gap-2 w-[60px] justify-end">
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          set.isPersonalBest
            ? 'bg-success/20 text-success opacity-100'
            : 'opacity-0'
        } ${isPbPulsing ? 'animate-pbPulse' : ''}`}
      >
        PB
      </span>

      {!disabled && (
        <button
          type="button"
          aria-label="Delete set"
          onClick={onDelete}
          className="w-6 h-6 flex items-center justify-center text-text-secondary active:scale-95 transition-transform opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
)
}
