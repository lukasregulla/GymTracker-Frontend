import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, Loader2, Search, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCreateSession } from '@/hooks/useSessions'
import { useTemplates } from '@/hooks/useTemplates'
import type { TemplateDto } from '@/types'

export default function NewSession() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const prefillDate = searchParams.get('date') ?? ''

  const [date, setDate] = useState(prefillDate || format(new Date(), 'yyyy-MM-dd'))
  const [sessionName, setSessionName] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDto | null>(null)
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false)
  const [templateSearch, setTemplateSearch] = useState('')

  const createSession = useCreateSession()
  const { data: templates } = useTemplates()

  const filteredTemplates = templates?.filter((t) =>
    t.name.toLowerCase().includes(templateSearch.toLowerCase())
  ) ?? []

  const handleCreate = () => {
    createSession.mutate(
      {
        name: !selectedTemplate && sessionName.trim() ? sessionName.trim() : undefined,
        scheduledDate: date || undefined,
        templateId: selectedTemplate?.id ?? undefined,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: (session) => navigate(`/sessions/${session.id}`),
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
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">New Session</h1>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-text-secondary text-sm">Date (optional)</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Template picker */}
      <div className="space-y-2">
        <label className="text-text-secondary text-sm">Template (optional)</label>
        {selectedTemplate ? (
          <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-medium text-white truncate">{selectedTemplate.name}</p>
              {selectedTemplate.dayOfWeek && (
                <p className="text-text-secondary text-sm">{selectedTemplate.dayOfWeek}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Clear template"
              onClick={() => setSelectedTemplate(null)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary active:scale-95 transition-transform shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setTemplatePickerOpen(true)}
            className="w-full bg-surface border border-border rounded-xl p-4 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
          >
            <span className="text-text-secondary">No template — start empty</span>
            <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
          </button>
        )}
      </div>

      {/* Session name — only when no template */}
      {!selectedTemplate && (
        <div className="space-y-2">
          <label className="text-text-secondary text-sm">Session name (optional)</label>
          <Input
            placeholder="e.g. Chest Day X"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value.slice(0, 100))}
            maxLength={100}
          />
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-text-secondary text-sm">Notes (optional)</label>
        <Input
          placeholder="e.g. Feeling strong today"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button className="w-full" onClick={handleCreate} disabled={createSession.isPending}>
        {createSession.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Session'}
      </Button>

      {/* Template picker sheet */}
      <Sheet
        open={templatePickerOpen}
        onOpenChange={(open) => {
          setTemplatePickerOpen(open)
          if (!open) setTemplateSearch('')
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Choose Template</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input
                placeholder="Search templates..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="space-y-2">
              {filteredTemplates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(t)
                    setTemplatePickerOpen(false)
                    setTemplateSearch('')
                  }}
                  className="w-full bg-surface2 border border-border rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
                >
                  <p className="font-medium text-white">{t.name}</p>
                  {t.dayOfWeek && (
                    <p className="text-text-secondary text-sm">{t.dayOfWeek}</p>
                  )}
                  {t.description && (
                    <p className="text-text-secondary text-sm truncate">{t.description}</p>
                  )}
                </button>
              ))}
              {filteredTemplates.length === 0 && (
                <p className="text-text-secondary text-center py-4 text-sm">
                  {templates?.length === 0
                    ? 'No templates yet. Create one from the Templates tab.'
                    : 'No templates match your search.'}
                </p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
