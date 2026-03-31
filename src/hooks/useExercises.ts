import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { exercisesApi } from '@/api/exercises'

export const useExercises = () =>
  useQuery({
    queryKey: ['exercises'],
    queryFn: exercisesApi.getAll,
    staleTime: 1000 * 60 * 5,
  })

export const useExercise = (id: number) =>
  useQuery({
    queryKey: ['exercises', id],
    queryFn: () => exercisesApi.getById(id),
    staleTime: 1000 * 60 * 5,
  })

export const useExerciseProgress = (id: number) =>
  useQuery({
    queryKey: ['exercises', id, 'progress'],
    queryFn: () => exercisesApi.getProgress(id),
    staleTime: 1000 * 60 * 5,
  })

export const useCreateExercise = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: exercisesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exercises'] }),
  })
}

export const useUpdateExercise = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; name?: string; muscleGroup?: string; notes?: string }) =>
      exercisesApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exercises'] }),
  })
}

export const useDeleteExercise = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: exercisesApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exercises'] }),
  })
}
