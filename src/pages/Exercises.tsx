import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Loader2, Dumbbell, Pencil, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { SkeletonCard } from '@/components/SkeletonCard'
import { useExercises, useCreateExercise, useUpdateExercise, useDeleteExercise } from '@/hooks/useExercises'
import type { ExerciseDto } from '@/types'

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio']

export default function Exercises() {
  const navigate = useNavigate()
  const { data: exercises, isLoading } = useExercises()

  const [search, setSearch] = useState('')
  const [muscleFilter, setMuscleFilter] = useState('All')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // Create form
  const [name, setName] = useState('')
  const [muscleGroup, setMuscleGroup] = useState('')
  const [notes, setNotes] = useState('')

  // Edit form
  const [editExercise, setEditExercise] = useState<ExerciseDto | null>(null)
  const [editName, setEditName] = useState('')
  const [editMuscleGroup, setEditMuscleGroup] = useState('')
  const [editNotes, setEditNotes] = useState('')

  const createExercise = useCreateExercise()
  const updateExercise = useUpdateExercise()
  const deleteExercise = useDeleteExercise()

  const filtered = exercises?.filter((ex) => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchMuscle = muscleFilter === 'All' || ex.muscleGroup === muscleFilter
    return matchSearch && matchMuscle
  }) ?? []

  const handleCreate = () => {
    if (!name.trim() || !muscleGroup.trim()) return
    createExercise.mutate(
      { name: name.trim(), muscleGroup: muscleGroup.trim(), notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          setCreateOpen(false)
          setName('')
          setMuscleGroup('')
          setNotes('')
        },
      }
    )
  }

  const openEdit = (ex: ExerciseDto) => {
    setEditExercise(ex)
    setEditName(ex.name)
    setEditMuscleGroup(ex.muscleGroup)
    setEditNotes(ex.notes ?? '')
  }

  const handleEdit = () => {
    if (!editExercise || !editName.trim() || !editMuscleGroup.trim()) return
    updateExercise.mutate(
      {
        id: editExercise.id,
        name: editName.trim(),
        muscleGroup: editMuscleGroup.trim(),
        notes: editNotes.trim() || undefined,
      },
      { onSuccess: () => setEditExercise(null) }
    )
  }

  const handleDelete = () => {
    if (deleteId === null) return
    deleteExercise.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    })
  }

  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="flex items-center justify-between">
  <h1 className="text-2xl font-bold text-white">Exercises</h1>
  <Sheet open={createOpen} onOpenChange={setCreateOpen}>
    <SheetTrigger asChild>
      <button
        type="button"
        aria-label="Add exercise"
        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>
    </SheetTrigger>
  </Sheet>
</div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Muscle group filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {MUSCLE_GROUPS.map((mg) => (
          <button
            key={mg}
            type="button"
            onClick={() => setMuscleFilter(mg)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors active:scale-95 ${
              muscleFilter === mg
                ? 'bg-primary text-white'
                : 'bg-surface2 text-text-secondary border border-border'
            }`}
          >
            {mg}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((ex) => (
            <div
              key={ex.id}
              className="bg-surface border border-border rounded-xl flex items-center animate-scaleIn overflow-hidden"
            >
              <button
                type="button"
                onClick={() => navigate(`/exercises/${ex.id}/progress`)}
                className="flex-1 p-4 flex items-center gap-3 text-left active:bg-surface2 transition-colors min-w-0"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{ex.name}</p>
                  <p className="text-text-secondary text-sm">{ex.muscleGroup}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {ex.personalBest !== null && (
                    <span className="text-success text-sm font-medium">{ex.personalBest}kg PB</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                </div>
              </button>
              <button
                type="button"
                aria-label={`Edit ${ex.name}`}
                onClick={() => openEdit(ex)}
                className="px-4 self-stretch flex items-center justify-center text-text-secondary border-l border-border active:bg-surface2 transition-colors shrink-0"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <p className="text-text-secondary">No exercises found</p>
        </div>
      )}

      {/* FAB — create exercise */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Exercise</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4 space-y-4">
            <Input
              placeholder="Exercise name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex gap-2 flex-wrap">
              {MUSCLE_GROUPS.slice(1).map((mg) => (
                <button
                  key={mg}
                  type="button"
                  onClick={() => setMuscleGroup(mg)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors active:scale-95 ${
                    muscleGroup === mg
                      ? 'bg-primary text-white'
                      : 'bg-surface2 text-text-secondary border border-border'
                  }`}
                >
                  {mg}
                </button>
              ))}
            </div>
            <Input
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={handleCreate}
              disabled={createExercise.isPending || !name.trim() || !muscleGroup.trim()}
            >
              {createExercise.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Exercise'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit exercise sheet */}
      <Sheet open={editExercise !== null} onOpenChange={(open) => !open && setEditExercise(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Exercise</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4 space-y-4">
            <Input
              placeholder="Exercise name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className="flex gap-2 flex-wrap">
              {MUSCLE_GROUPS.slice(1).map((mg) => (
                <button
                  key={mg}
                  type="button"
                  onClick={() => setEditMuscleGroup(mg)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors active:scale-95 ${
                    editMuscleGroup === mg
                      ? 'bg-primary text-white'
                      : 'bg-surface2 text-text-secondary border border-border'
                  }`}
                >
                  {mg}
                </button>
              ))}
            </div>
            <Input
              placeholder="Notes (optional)"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={handleEdit}
              disabled={updateExercise.isPending || !editName.trim() || !editMuscleGroup.trim()}
            >
              {updateExercise.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Exercise?</DialogTitle>
            <DialogDescription>This will permanently delete the exercise and all its history.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteExercise.isPending}>
              {deleteExercise.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
