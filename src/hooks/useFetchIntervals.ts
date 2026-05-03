import { useQuery } from '@tanstack/react-query';
import { getDriverIntervals } from '../services/intervalService';

export function useFetchIntervals(session_key: number) {
  return useQuery({
    queryKey: ['intervals', session_key],
    queryFn: () => getDriverIntervals(session_key),
    enabled: session_key > 0,
  });
}
