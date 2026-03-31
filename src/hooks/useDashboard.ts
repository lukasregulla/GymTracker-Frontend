import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

export const useDashboardWeek = () =>
  useQuery({
    queryKey: ['dashboard', 'week'],
    queryFn: dashboardApi.getWeek,
    staleTime: 1000 * 60 * 2,
  })

export const useDashboardRecent = (count = 5) =>
  useQuery({
    queryKey: ['dashboard', 'recent', count],
    queryFn: () => dashboardApi.getRecent(count),
    staleTime: 1000 * 60 * 2,
  })
