import { useQuery } from '@tanstack/react-query';
import { getAllStints } from '../services/stintService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchStints(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['stints', session_key],
    queryFn: () => getAllStints(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}
