import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateTemplate } from '@/hooks/useTemplates'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function NewTemplate() {
  const navigate = useNavigate()
  const createTemplate = useCreateTemplate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    createTemplate.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        dayOfWeek: dayOfWeek || undefined,
      },
      {
        onSuccess: (t) => navigate(`/templates/${t.id}`),
      }
    )
  }

  return (
    <div className="px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => navigate('/templates')}
          className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">New Template</h1>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="text-text-secondary text-sm">Name *</label>
        <Input
          placeholder="e.g. Push Day, Leg Day"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-text-secondary text-sm">Description (optional)</label>
        <Input
          placeholder="e.g. Chest, shoulders, triceps"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Day of week */}
      <div className="space-y-2">
        <label className="text-text-secondary text-sm">Day of week (optional)</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDayOfWeek(dayOfWeek === d ? '' : d)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors active:scale-95 ${
                dayOfWeek === d
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
        onClick={handleCreate}
        disabled={createTemplate.isPending || !name.trim()}
      >
        {createTemplate.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Template'}
      </Button>
    </div>
  )
}
