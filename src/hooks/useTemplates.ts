import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { templatesApi } from '@/api/templates'

export const useTemplates = () =>
  useQuery({
    queryKey: ['templates'],
    queryFn: templatesApi.getAll,
    staleTime: 1000 * 60 * 5,
  })

export const useTemplate = (id: number) =>
  useQuery({
    queryKey: ['template', id],
    queryFn: () => templatesApi.getById(id),
    staleTime: 1000 * 60 * 5,
  })

export const useCreateTemplate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: templatesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  })
}

export const useUpdateTemplate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; name?: string; description?: string; dayOfWeek?: string }) =>
      templatesApi.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['templates'] })
      qc.invalidateQueries({ queryKey: ['template', id] })
    },
  })
}

export const useDeleteTemplate = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: templatesApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  })
}

export const useAddTemplateExercise = (templateId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { exerciseId: number; defaultSets: number; defaultReps: number; orderIndex: number }) =>
      templatesApi.addExercise(templateId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['template', templateId] }),
  })
}

export const useRemoveTemplateExercise = (templateId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (templateExerciseId: number) =>
      templatesApi.removeExercise(templateId, templateExerciseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['template', templateId] }),
  })
}

export const useReorderTemplateExercises = (templateId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (items: Array<{ templateExerciseId: number; orderIndex: number }>) =>
      templatesApi.reorder(templateId, items),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['template', templateId] }),
  })
}
