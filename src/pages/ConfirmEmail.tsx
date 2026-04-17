import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Loader2, Dumbbell, CheckCircle, AlertCircle } from 'lucide-react'
import { useConfirmEmail } from '@/hooks/useAuth'
import { AxiosError } from 'axios'

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('userId')
  const token = searchParams.get('token')

  const confirmEmail = useConfirmEmail()

  useEffect(() => {
    if (!userId || !token) return
    if (confirmEmail.isPending || confirmEmail.isSuccess || confirmEmail.isError) return
    confirmEmail.mutate({ userId, token })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const errorMessage =
    confirmEmail.error instanceof Error
      ? (confirmEmail.error as AxiosError<{ message?: string }>).response?.data?.message ??
        confirmEmail.error.message
      : 'Something went wrong.'

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-3">
            <Dumbbell className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">GymTracker</h1>
        </div>

        {(!userId || !token) && (
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-danger/20 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-danger" />
            </div>
            <h2 className="text-lg font-semibold text-white">Invalid link</h2>
            <p className="text-text-secondary text-sm">This confirmation link is missing required parameters.</p>
            <Link to="/login" className="text-primary font-medium text-sm">Back to log in</Link>
          </div>
        )}

        {userId && token && confirmEmail.isPending && (
          <div className="flex flex-col items-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-text-secondary text-sm">Verifying your email...</p>
          </div>
        )}

        {confirmEmail.isSuccess && (
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-success" />
            </div>
            <h2 className="text-lg font-semibold text-white">Email confirmed!</h2>
            <p className="text-text-secondary text-sm">Your account is active. You can now log in.</p>
            <Link
              to="/login"
              className="mt-2 w-full inline-flex items-center justify-center h-12 rounded-xl bg-primary text-white font-medium active:scale-95 transition-transform"
            >
              Log in
            </Link>
          </div>
        )}

        {confirmEmail.isError && (
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-danger/20 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-danger" />
            </div>
            <h2 className="text-lg font-semibold text-white">Confirmation failed</h2>
            <p className="text-danger text-sm">{errorMessage}</p>
            <p className="text-text-secondary text-xs">The link may have expired. Try registering again.</p>
            <Link to="/login" className="text-primary font-medium text-sm mt-2">Back to log in</Link>
          </div>
        )}
      </div>
    </div>
  )
}
