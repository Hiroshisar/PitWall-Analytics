import { useQuery } from '@tanstack/react-query';
import { getOvertakes } from '../services/overtakeService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchOvertakes(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['overtakes', session_key],
    queryFn: () => getOvertakes(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}
