import { useQuery } from '@tanstack/react-query';
import { getDriverLocation } from '../services/locationService';
import { isValidOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchLocation(
  session_key: OpenF1Key,
  driver_number: number
) {
  return useQuery({
    queryKey: ['location', session_key, driver_number],
    queryFn: () => getDriverLocation(session_key, driver_number),
    enabled: isValidOpenF1Key(session_key) && driver_number > 0,
  });
}
