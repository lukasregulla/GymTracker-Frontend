import client from './client'
import type { SessionDto, SessionDetailDto } from '@/types'

export const sessionsApi = {
  getAll: async (from?: string, to?: string): Promise<SessionDto[]> => {
    const { data } = await client.get<SessionDto[]>('/api/sessions', { params: { from, to } })
    return data
  },

  getById: async (id: number): Promise<SessionDetailDto> => {
    const { data } = await client.get<SessionDetailDto>(`/api/sessions/${id}`)
    return data
  },

  create: async (payload: { name?: string; scheduledDate?: string; templateId?: number; notes?: string }): Promise<SessionDto> => {
    const { data } = await client.post<SessionDto>('/api/sessions', payload)
    return data
  },

  complete: async (id: number): Promise<SessionDto> => {
    const { data } = await client.patch<SessionDto>(`/api/sessions/${id}/complete`)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/api/sessions/${id}`)
  },

  addExercise: async (sessionId: number, exerciseId: number, orderIndex: number) => {
    const { data } = await client.post(`/api/sessions/${sessionId}/exercises`, { exerciseId, orderIndex })
    return data
  },

  removeExercise: async (sessionId: number, sessionExerciseId: number): Promise<void> => {
    await client.delete(`/api/sessions/${sessionId}/exercises/${sessionExerciseId}`)
  },
}
