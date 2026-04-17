import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Dumbbell, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForgotPassword } from '@/hooks/useAuth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const forgotPassword = useForgotPassword()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    forgotPassword.mutate({ email })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center mb-3">
              <Mail className="w-7 h-7 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-white">Check your email</h1>
            <p className="text-text-secondary text-sm mt-2">
              If an account with that email exists, we've sent a password reset link.
            </p>
          </div>
          <p className="text-center text-text-secondary text-sm">
            <Link to="/login" className="text-primary font-medium">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
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
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <Button type="submit" className="w-full" disabled={forgotPassword.isPending}>
            {forgotPassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send reset link'}
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
