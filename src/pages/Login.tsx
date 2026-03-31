import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/hooks/useAuth'
import { AxiosError } from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const login = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    login.mutate(
      { email, password },
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-3">
            <Dumbbell className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">GymTracker</h1>
          <p className="text-text-secondary text-sm mt-1">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              autoComplete="current-password"
              required
            />
            {fieldErrors.password?.map((msg) => (
              <p key={msg} className="text-danger text-xs mt-1">{msg}</p>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
          </Button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
