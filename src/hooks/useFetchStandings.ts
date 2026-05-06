import { useQuery } from '@tanstack/react-query';
import { getStandings } from '../services/standingService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchStandings(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['standings', session_key],
    queryFn: async () => await getStandings(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}
