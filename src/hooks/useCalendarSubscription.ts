import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { calendarApi } from '@/api/calendar'

export const useCalendarSubscription = () =>
  useQuery({
    queryKey: ['calendarSubscription'],
    queryFn: calendarApi.getSubscriptionLink,
    staleTime: Infinity,
  })

export const useResetCalendarSubscription = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: calendarApi.resetSubscriptionLink,
    onSuccess: (data) => {
      qc.setQueryData(['calendarSubscription'], data)
    },
  })
}
