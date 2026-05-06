import { useQuery } from '@tanstack/react-query';
import { getStartingGrid } from '../services/startingGridService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchStartingGrid(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['starting-grid', session_key],
    queryFn: () => getStartingGrid(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}
