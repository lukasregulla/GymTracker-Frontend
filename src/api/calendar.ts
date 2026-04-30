import client from './client'

interface CalendarSubscriptionDto {
  calendarUrl: string
}

export const calendarApi = {
  getSubscriptionLink: async (): Promise<CalendarSubscriptionDto> => {
    const { data } = await client.get<CalendarSubscriptionDto>('/api/calendar/subscription-link')
    return data
  },

  resetSubscriptionLink: async (): Promise<CalendarSubscriptionDto> => {
    const { data } = await client.post<CalendarSubscriptionDto>('/api/calendar/reset-subscription-link')
    return data
  },
}
