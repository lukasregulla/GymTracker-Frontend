import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { runSessionsApi } from '@/api/runSessions'

export const useRunSessions = () =>
  useQuery({
    queryKey: ['runSessions'],
    queryFn: runSessionsApi.getAll,
    staleTime: 1000 * 60 * 2,
  })

export const useRunSession = (id: number) =>
  useQuery({
    queryKey: ['runSession', id],
    queryFn: () => runSessionsApi.getById(id),
    staleTime: 1000 * 60 * 5,
  })

export const useCreateRunSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: runSessionsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['runSessions'] })
    },
  })
}

export const useScheduleRunSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: runSessionsApi.schedule,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['runSessions'] }),
  })
}

export const useCompleteRunSession = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof runSessionsApi.complete>[1]) =>
      runSessionsApi.complete(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['runSession', id] })
      qc.invalidateQueries({ queryKey: ['runSessions'] })
    },
  })
}
