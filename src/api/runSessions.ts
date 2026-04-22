import client from './client'
import type { RunSessionDto } from '@/types'

export const runSessionsApi = {
  create: async (payload: {
    name?: string | null
    scheduledDate?: string | null
    notes?: string
    distanceKm: number
    durationSeconds: number
    runType?: string
  }): Promise<RunSessionDto> => {
    const { data } = await client.post<RunSessionDto>('/api/sessions/run', payload)
    return data
  },

  schedule: async (payload: {
    name?: string | null
    scheduledDate: string
    notes?: string
    distanceKm?: number | null
    runType?: string | null
  }): Promise<RunSessionDto> => {
    const { data } = await client.post<RunSessionDto>('/api/sessions/run/schedule', payload)
    return data
  },

  complete: async (id: number, payload: {
    distanceKm: number
    durationSeconds: number
    runType?: string | null
    notes?: string | null
  }): Promise<RunSessionDto> => {
    const { data } = await client.patch<RunSessionDto>(`/api/sessions/runs/${id}/complete`, payload)
    return data
  },

  getAll: async (): Promise<RunSessionDto[]> => {
    const { data } = await client.get<RunSessionDto[]>('/api/sessions/runs')
    return data
  },

  getById: async (id: number): Promise<RunSessionDto> => {
    const { data } = await client.get<RunSessionDto>(`/api/sessions/runs/${id}`)
    return data
  },
}
