import client from './client'
import type { TemplateDto, TemplateDetailDto } from '@/types'

export const templatesApi = {
  getAll: async (): Promise<TemplateDto[]> => {
    const { data } = await client.get<TemplateDto[]>('/api/templates')
    return data
  },

  getById: async (id: number): Promise<TemplateDetailDto> => {
    const { data } = await client.get<TemplateDetailDto>(`/api/templates/${id}`)
    return data
  },

  create: async (payload: { name: string; description?: string; dayOfWeek?: string }): Promise<TemplateDto> => {
    const { data } = await client.post<TemplateDto>('/api/templates', payload)
    return data
  },

  update: async (id: number, payload: { name?: string; description?: string; dayOfWeek?: string }): Promise<TemplateDto> => {
    const { data } = await client.put<TemplateDto>(`/api/templates/${id}`, payload)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/api/templates/${id}`)
  },

  addExercise: async (
    templateId: number,
    payload: { exerciseId: number; defaultSets: number; defaultReps: number; orderIndex: number }
  ) => {
    const { data } = await client.post(`/api/templates/${templateId}/exercises`, payload)
    return data
  },

  removeExercise: async (templateId: number, templateExerciseId: number): Promise<void> => {
    await client.delete(`/api/templates/${templateId}/exercises/${templateExerciseId}`)
  },

  reorder: async (
    templateId: number,
    items: Array<{ templateExerciseId: number; orderIndex: number }>
  ): Promise<void> => {
    await client.put(`/api/templates/${templateId}/exercises/reorder`, { items })
  },
}
