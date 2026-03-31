import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import { SkeletonCard } from '@/components/SkeletonCard'
import { useTemplates } from '@/hooks/useTemplates'

export default function Templates() {
  const navigate = useNavigate()
  const { data: templates, isLoading } = useTemplates()

  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Templates</h1>
        <button
          type="button"
          aria-label="New template"
          onClick={() => navigate('/templates/new')}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : templates && templates.length > 0 ? (
        <div className="space-y-2">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate(`/templates/${t.id}`)}
              className="w-full bg-surface border border-border rounded-xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform animate-scaleIn"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{t.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {t.dayOfWeek && (
                    <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                      {t.dayOfWeek}
                    </span>
                  )}
                  {t.description && (
                    <p className="text-text-secondary text-sm truncate">{t.description}</p>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <p className="text-text-secondary">No templates yet</p>
          <button
            type="button"
            onClick={() => navigate('/templates/new')}
            className="text-primary text-sm font-medium mt-2 active:scale-95 transition-transform"
          >
            + Create your first template
          </button>
        </div>
      )}
    </div>
  )
}
