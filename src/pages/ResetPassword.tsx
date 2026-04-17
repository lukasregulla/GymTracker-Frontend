import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Loader2, Dumbbell, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useResetPassword } from '@/hooks/useAuth'
import { AxiosError } from 'axios'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [resetError, setResetError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const resetPassword = useResetPassword()

  if (!email || !token) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-danger/20 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-danger" />
          </div>
          <h2 className="text-lg font-semibold text-white">Invalid or expired link</h2>
          <p className="text-text-secondary text-sm">This password reset link is missing required parameters.</p>
          <Link to="/login" className="text-primary font-medium text-sm mt-2">Back to log in</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setResetError(null)
    setFieldErrors({})

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    resetPassword.mutate(
      { email, token, newPassword },
      {
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
          if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
            setFieldErrors(axiosErr.response.data.errors)
          } else {
            setResetError(axiosErr.response?.data?.message ?? 'Something went wrong. Please try again.')
          }
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-3">
            <Dumbbell className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">GymTracker</h1>
          <p className="text-text-secondary text-sm mt-1">Reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            {fieldErrors.newPassword?.map((msg) => (
              <p key={msg} className="text-danger text-xs mt-1">{msg}</p>
            ))}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            {passwordError && (
              <p className="text-danger text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {resetError && (
            <div className="rounded-xl bg-danger/10 border border-danger/30 p-3">
              <p className="text-danger text-sm">{resetError}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
            {resetPassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
          </Button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          <Link to="/login" className="text-primary font-medium">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  )
}
