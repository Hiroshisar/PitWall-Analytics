import { useQuery } from '@tanstack/react-query';
import { getDrivers } from '../services/driverService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchDrivers(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['driver', session_key],
    queryFn: () => getDrivers(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}
