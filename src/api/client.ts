import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]>; status?: number }>) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? ''
      const isAuthEndpoint = url.includes('/api/auth/login') || url.includes('/api/auth/register')
      if (isAuthEndpoint) {
        return Promise.reject(error)
      }
      localStorage.removeItem('gym_token')
      localStorage.removeItem('gym_username')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    const data = error.response?.data

    if (error.response?.status === 422 && data?.errors) {
      const messages = Object.values(data.errors).flat().join(', ')
      toast({ title: 'Validation error', description: messages, variant: 'danger' })
    } else if (data?.message) {
      toast({ title: 'Error', description: data.message, variant: 'danger' })
    } else if (error.message) {
      toast({ title: 'Network error', description: error.message, variant: 'danger' })
    }

    return Promise.reject(error)
  }
)

export default client
