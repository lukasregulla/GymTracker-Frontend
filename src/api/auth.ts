import client from './client'

interface AuthResponse {
  token: string
  username: string
}

export const authApi = {
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await client.post<AuthResponse>('/api/auth/register', { username, email, password })
    localStorage.setItem('gym_token', data.token)
    localStorage.setItem('gym_username', data.username)
    return data
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await client.post<AuthResponse>('/api/auth/login', { email, password })
    localStorage.setItem('gym_token', data.token)
    localStorage.setItem('gym_username', data.username)
    return data
  },
}
