import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Dumbbell, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRegister } from '@/hooks/useAuth'
import { AxiosError } from 'axios'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const register = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    register.mutate(
      { username, email, password },
      {
        onError: (err) => {
          const axiosErr = err as AxiosError<{ errors?: Record<string, string[]> }>
          if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
            setFieldErrors(axiosErr.response.data.errors)
          }
        },
      }
    )
  }

  if (register.isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center mb-3">
              <Mail className="w-7 h-7 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-white">Check your email</h1>
            <p className="text-text-secondary text-sm mt-1 text-center">
              We've sent a confirmation link to{' '}
              <span className="text-white font-medium">{email}</span>.
              Click the link to activate your account.
            </p>
          </div>
          <p className="text-center text-text-secondary text-sm mt-6">
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
          <p className="text-text-secondary text-sm mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
            {fieldErrors.username?.map((msg) => (
              <p key={msg} className="text-danger text-xs mt-1">{msg}</p>
            ))}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            {fieldErrors.email?.map((msg) => (
              <p key={msg} className="text-danger text-xs mt-1">{msg}</p>
            ))}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            {fieldErrors.password?.map((msg) => (
              <p key={msg} className="text-danger text-xs mt-1">{msg}</p>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
