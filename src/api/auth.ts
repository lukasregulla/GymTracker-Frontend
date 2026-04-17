import client from './client'

interface AuthResponse {
  token: string
  username: string
}

interface MessageResponse {
  message: string
}

export const authApi = {
  register: async (username: string, email: string, password: string): Promise<MessageResponse> => {
    const { data } = await client.post<MessageResponse>('/api/auth/register', { username, email, password })
    return data
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await client.post<AuthResponse>('/api/auth/login', { email, password })
    localStorage.setItem('gym_token', data.token)
    localStorage.setItem('gym_username', data.username)
    return data
  },

  confirmEmail: async (userId: string, token: string): Promise<MessageResponse> => {
    const { data } = await client.post<MessageResponse>('/api/auth/confirm-email', { userId, token })
    return data
  },

  forgotPassword: async (email: string): Promise<void> => {
    await client.post('/api/auth/forgot-password', { email })
  },

  resetPassword: async (email: string, token: string, newPassword: string): Promise<MessageResponse> => {
    const { data } = await client.post<MessageResponse>('/api/auth/reset-password', { email, token, newPassword })
    return data
  },
}
