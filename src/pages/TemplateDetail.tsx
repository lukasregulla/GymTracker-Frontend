import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Loader2, Search, ChevronUp, ChevronDown, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { SkeletonCard } from '@/components/SkeletonCard'
import {
  useTemplate,
  useDeleteTemplate,
  useUpdateTemplate,
  useAddTemplateExercise,
  useRemoveTemplateExercise,
  useReorderTemplateExercises,
} from '@/hooks/useTemplates'
import { useExercises } from '@/hooks/useExercises'
import type { TemplateExerciseDto } from '@/types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>()
  const templateId = Number(id)
  const navigate = useNavigate()

  const { data: template, isLoading } = useTemplate(templateId)
  const deleteTemplate = useDeleteTemplate()
  const updateTemplate = useUpdateTemplate()
  const addExercise = useAddTemplateExercise(templateId)
  const removeExercise = useRemoveTemplateExercise(templateId)
  const reorder = useReorderTemplateExercises(templateId)

  const { data: allExercises } = useExercises()

  // Edit sheet state
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDay, setEditDay] = useState('')

  // Add exercise sheet state
  const [addOpen, setAddOpen] = useState(false)
  const [exSearch, setExSearch] = useState('')
  const [selectedExId, setSelectedExId] = useState<number | null>(null)
  const [defaultSets, setDefaultSets] = useState('3')
  const [defaultReps, setDefaultReps] = useState('10')

  // Delete / remove confirm state
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [removeExId, setRemoveExId] = useState<number | null>(null)

  const openEdit = () => {
    if (!template) return
    setEditName(template.name)
    setEditDescription(template.description ?? '')
    setEditDay(template.dayOfWeek ?? '')
    setEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editName.trim()) return
    updateTemplate.mutate(
      {
        id: templateId,
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        dayOfWeek: editDay || undefined,
      },
      { onSuccess: () => setEditOpen(false) }
    )
  }

  const handleDelete = () => {
    deleteTemplate.mutate(templateId, {
      onSuccess: () => navigate('/templates'),
    })
  }

  const handleAdd = () => {
    if (!selectedExId) return
    const orderIndex = template?.exercises.length ?? 0
    addExercise.mutate(
      { exerciseId: selectedExId, defaultSets: Number(defaultSets), defaultReps: Number(defaultReps), orderIndex },
      {
        onSuccess: () => {
          setAddOpen(false)
          setSelectedExId(null)
          setExSearch('')
          setDefaultSets('3')
          setDefaultReps('10')
        },
      }
    )
  }

  const handleRemove = () => {
    if (removeExId === null) return
    // removeExId holds templateExerciseId (NOT exerciseId)
    removeExercise.mutate(removeExId, {
      onSuccess: () => setRemoveExId(null),
    })
  }

  const handleMoveUp = (ex: TemplateExerciseDto) => {
    if (!template) return
    const sorted = [...template.exercises].sort((a, b) => a.orderIndex - b.orderIndex)
    const idx = sorted.findIndex((e) => e.templateExerciseId === ex.templateExerciseId)
    if (idx === 0) return
    const items = sorted.map((e, i) => ({
      templateExerciseId: e.templateExerciseId,
      orderIndex: i === idx ? i - 1 : i === idx - 1 ? i + 1 : i,
    }))
    reorder.mutate(items)
  }

  const handleMoveDown = (ex: TemplateExerciseDto) => {
    if (!template) return
    const sorted = [...template.exercises].sort((a, b) => a.orderIndex - b.orderIndex)
    const idx = sorted.findIndex((e) => e.templateExerciseId === ex.templateExerciseId)
    if (idx === sorted.length - 1) return
    const items = sorted.map((e, i) => ({
      templateExerciseId: e.templateExerciseId,
      orderIndex: i === idx ? i + 1 : i === idx + 1 ? i - 1 : i,
    }))
    reorder.mutate(items)
  }

  const filteredExercises =
    allExercises?.filter(
      (ex) =>
        ex.name.toLowerCase().includes(exSearch.toLowerCase()) &&
        !template?.exercises.some((te) => te.exerciseId === ex.id)
    ) ?? []

  if (isLoading) {
    return (
      <div className="px-4 pt-6 space-y-4">
        <SkeletonCard className="h-16" />
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!template) {
    return (
      <div className="px-4 pt-6 text-center">
        <p className="text-text-secondary">Template not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/templates')}>
          Back
        </Button>
      </div>
    )
  }

  const sorted = [...template.exercises].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <div className="px-4 pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Back to templates"
          onClick={() => navigate('/templates')}
          className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center active:scale-95 transition-transform shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{template.name}</h1>
          {template.dayOfWeek && (
            <span className="text-primary text-sm">{template.dayOfWeek}</span>
          )}
        </div>

        <button
          type="button"
          aria-label="Edit template"
          onClick={openEdit}
          className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center active:scale-95 transition-transform shrink-0"
        >
          <Pencil className="w-4 h-4 text-white" />
        </button>

        <button
          type="button"
          aria-label="Delete template"
          onClick={() => setDeleteOpen(true)}
          className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center active:scale-95 transition-transform shrink-0"
        >
          <Trash2 className="w-4 h-4 text-danger" />
        </button>
      </div>

      {template.description && (
        <p className="text-text-secondary text-sm">{template.description}</p>
      )}

      {/* Exercise list */}
      <div className="space-y-2">
        {sorted.map((ex, idx) => (
          <div
            key={ex.templateExerciseId}
            className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3 animate-scaleIn"
          >
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                aria-label="Move up"
                onClick={() => handleMoveUp(ex)}
                disabled={idx === 0}
                className="w-6 h-6 flex items-center justify-center text-text-secondary disabled:opacity-20 active:scale-95 transition-transform"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Move down"
                onClick={() => handleMoveDown(ex)}
                disabled={idx === sorted.length - 1}
                className="w-6 h-6 flex items-center justify-center text-text-secondary disabled:opacity-20 active:scale-95 transition-transform"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{ex.exerciseName}</p>
              <p className="text-text-secondary text-sm">
                {ex.defaultSets} sets × {ex.defaultReps} reps
              </p>
            </div>

            <button
              type="button"
              aria-label={`Remove ${ex.exerciseName}`}
              onClick={() => setRemoveExId(ex.templateExerciseId)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary active:scale-95 transition-transform"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {sorted.length === 0 && (
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <p className="text-text-secondary">No exercises yet</p>
          </div>
        )}
      </div>

      <Button className="w-full" onClick={() => setAddOpen(true)}>
        <Plus className="w-4 h-4" />
        Add Exercise
      </Button>

      {/* ── Edit template sheet ── */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Template</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <label className="text-text-secondary text-sm">Name *</label>
              <Input
                placeholder="Template name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-text-secondary text-sm">Description (optional)</label>
              <Input
                placeholder="e.g. Chest, shoulders, triceps"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-text-secondary text-sm">Day of week (optional)</p>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setEditDay(editDay === d ? '' : d)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors active:scale-95 ${
                      editDay === d
                        ? 'bg-primary text-white'
                        : 'bg-surface2 text-text-secondary border border-border'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleSaveEdit}
              disabled={updateTemplate.isPending || !editName.trim()}
            >
              {updateTemplate.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Add exercise sheet ── */}
      <Sheet
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open)
          if (!open) {
            setExSearch('')
            setSelectedExId(null)
          }
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

            <div className="space-y-2 max-h-52 overflow-y-auto">
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
                  onClick={() => setSelectedExId(ex.id)}
                  className={`w-full rounded-xl p-3 text-left active:scale-[0.98] transition-all border ${
                    selectedExId === ex.id
                      ? 'bg-primary/20 border-primary'
                      : 'bg-surface2 border-border'
                  }`}
                >
                  <p className="font-medium text-white">{ex.name}</p>
                  <p className="text-text-secondary text-sm">{ex.muscleGroup}</p>
                </button>
              ))}
            </div>

            {selectedExId && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-text-secondary text-xs">Default sets</label>
                  <Input
                    inputMode="numeric"
                    value={defaultSets}
                    onChange={(e) => setDefaultSets(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-text-secondary text-xs">Default reps</label>
                  <Input
                    inputMode="numeric"
                    value={defaultReps}
                    onChange={(e) => setDefaultReps(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleAdd}
              disabled={!selectedExId || addExercise.isPending}
            >
              {addExercise.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Add to Template'
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Delete template confirm ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template?</DialogTitle>
            <DialogDescription>
              This will permanently delete "{template.name}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteTemplate.isPending}>
              {deleteTemplate.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Remove exercise confirm ── */}
      <Dialog open={removeExId !== null} onOpenChange={(open) => !open && setRemoveExId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Exercise?</DialogTitle>
            <DialogDescription>Remove this exercise from the template.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveExId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemove} disabled={removeExercise.isPending}>
              {removeExercise.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
