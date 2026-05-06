import { useQuery } from '@tanstack/react-query';
import { getDriverIntervals } from '../services/intervalService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchIntervals(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['intervals', session_key],
    queryFn: () => getDriverIntervals(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}
