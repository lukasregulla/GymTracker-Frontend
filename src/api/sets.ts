import client from './client'
import type { SetDto } from '@/types'

export const setsApi = {
  logSet: async (
    sessionId: number,
    sessionExerciseId: number,
    payload: { weightKg: number; reps: number; setNumber: number }
  ): Promise<SetDto> => {
    const { data } = await client.post<SetDto>(
      `/api/sessions/${sessionId}/exercises/${sessionExerciseId}/sets`,
      payload
    )
    return data
  },

  updateSet: async (
    sessionId: number,
    sessionExerciseId: number,
    setId: number,
    payload: { weightKg?: number; reps?: number }
  ): Promise<SetDto> => {
    const { data } = await client.put<SetDto>(
      `/api/sessions/${sessionId}/exercises/${sessionExerciseId}/sets/${setId}`,
      payload
    )
    return data
  },

  deleteSet: async (
    sessionId: number,
    sessionExerciseId: number,
    setId: number
  ): Promise<void> => {
    await client.delete(
      `/api/sessions/${sessionId}/exercises/${sessionExerciseId}/sets/${setId}`
    )
  },
}
