import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'

export const useLogin = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: () => navigate('/'),
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
      authApi.register(username, email, password),
    onSuccess: () => navigate('/'),
  })
}
