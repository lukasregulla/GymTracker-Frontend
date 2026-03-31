import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionsApi } from '@/api/sessions'

export const useSessions = (from?: string, to?: string) =>
  useQuery({
    queryKey: ['sessions', { from, to }],
    queryFn: () => sessionsApi.getAll(from, to),
    staleTime: 1000 * 60 * 2,
  })

export const useSession = (id: number) =>
  useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionsApi.getById(id),
    staleTime: 0,
  })

export const useCreateSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: sessionsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useCompleteSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: sessionsApi.complete,
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['session', id] })
      qc.invalidateQueries({ queryKey: ['sessions'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: sessionsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useAddSessionExercise = (sessionId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ exerciseId, orderIndex }: { exerciseId: number; orderIndex: number }) =>
      sessionsApi.addExercise(sessionId, exerciseId, orderIndex),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['session', sessionId] }),
  })
}

export const useRemoveSessionExercise = (sessionId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (sessionExerciseId: number) =>
      sessionsApi.removeExercise(sessionId, sessionExerciseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['session', sessionId] }),
  })
}
