import { useQuery } from '@tanstack/react-query';
import { getDriverPosition } from '../services/positionService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchPosition(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['position', session_key],
    queryFn: () => getDriverPosition(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}
