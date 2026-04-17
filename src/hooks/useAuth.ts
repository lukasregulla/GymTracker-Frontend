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
  return useMutation({
    mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
      authApi.register(username, email, password),
  })
}

export const useConfirmEmail = () => {
  return useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) =>
      authApi.confirmEmail(userId, token),
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => authApi.forgotPassword(email),
  })
}

export const useResetPassword = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: ({ email, token, newPassword }: { email: string; token: string; newPassword: string }) =>
      authApi.resetPassword(email, token, newPassword),
    onSuccess: () =>
      navigate('/login', { state: { successMessage: 'Password reset successfully. Please log in.' } }),
  })
}
