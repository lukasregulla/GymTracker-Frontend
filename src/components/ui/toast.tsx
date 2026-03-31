import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast, dismissToast, type Toast } from '@/hooks/use-toast'

function ToastItem({ toast }: { toast: Toast }) {
  const icons = {
    default: <Info className="h-4 w-4 text-text-secondary shrink-0" />,
    success: <CheckCircle className="h-4 w-4 text-success shrink-0" />,
    danger: <AlertCircle className="h-4 w-4 text-danger shrink-0" />,
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl bg-surface2 border border-border animate-scaleIn shadow-lg',
        toast.variant === 'danger' && 'border-danger/30',
        toast.variant === 'success' && 'border-success/30'
      )}
    >
      {icons[toast.variant ?? 'default']}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-medium text-white">{toast.title}</p>
        )}
        {toast.description && (
          <p className="text-sm text-text-secondary mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => dismissToast(toast.id)}
        className="text-text-secondary active:scale-95 transition-transform shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function Toaster() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col gap-2 px-4 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  )
}
