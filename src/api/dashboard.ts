import client from './client'
import type { WeeklyDashboardDto, SessionDto } from '@/types'

export const dashboardApi = {
  getWeek: async (): Promise<WeeklyDashboardDto> => {
    const { data } = await client.get<WeeklyDashboardDto>('/api/dashboard/week')
    return data
  },

  getRecent: async (count = 5): Promise<SessionDto[]> => {
    const { data } = await client.get<SessionDto[]>('/api/dashboard/recent', { params: { count } })
    return data
  },
}
