import client from './client'
import type { ExerciseDto, ExerciseProgressDto } from '@/types'

export const exercisesApi = {
  getAll: async (): Promise<ExerciseDto[]> => {
    const { data } = await client.get<ExerciseDto[]>('/api/exercises')
    return data
  },

  getById: async (id: number): Promise<ExerciseDto> => {
    const { data } = await client.get<ExerciseDto>(`/api/exercises/${id}`)
    return data
  },

  create: async (payload: { name: string; muscleGroup: string; notes?: string }): Promise<ExerciseDto> => {
    const { data } = await client.post<ExerciseDto>('/api/exercises', payload)
    return data
  },

  update: async (id: number, payload: { name?: string; muscleGroup?: string; notes?: string }): Promise<ExerciseDto> => {
    const { data } = await client.put<ExerciseDto>(`/api/exercises/${id}`, payload)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/api/exercises/${id}`)
  },

  getProgress: async (id: number): Promise<ExerciseProgressDto> => {
    const { data } = await client.get<ExerciseProgressDto>(`/api/exercises/${id}/progress`)
    return data
  },
}
