import { useQuery } from '@tanstack/react-query';
import { getMeetingByKey, getMeetingByYear } from '../services/meetingService';

export function useFetchMeetings(year: number) {
  return useQuery({
    queryKey: ['meetings', year],
    queryFn: () => getMeetingByYear(year),
    enabled: Boolean(year),
  });
}

export function useFetchMeetingByKey(key: number) {
  return useQuery({
    queryKey: ['meeting', key],
    queryFn: () => getMeetingByKey(key),
    enabled: Boolean(key),
  });
}
