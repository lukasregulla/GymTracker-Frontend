import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setsApi } from '@/api/sets'

export const useLogSet = (sessionId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionExerciseId,
      weightKg,
      reps,
      setNumber,
    }: {
      sessionExerciseId: number
      weightKg: number
      reps: number
      setNumber: number
    }) => setsApi.logSet(sessionId, sessionExerciseId, { weightKg, reps, setNumber }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['session', sessionId] }),
  })
}

export const useUpdateSet = (sessionId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionExerciseId,
      setId,
      ...payload
    }: {
      sessionExerciseId: number
      setId: number
      setNumber: number
      weightKg?: number
      reps?: number
    }) => setsApi.updateSet(sessionId, sessionExerciseId, setId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['session', sessionId] }),
  })
}

export const useDeleteSet = (sessionId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionExerciseId,
      setId,
    }: {
      sessionExerciseId: number
      setId: number
    }) => setsApi.deleteSet(sessionId, sessionExerciseId, setId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['session', sessionId] }),
  })
}
