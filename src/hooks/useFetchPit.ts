import { useQuery } from '@tanstack/react-query';
import { getPitsByDrivers, getPitStops } from '../services/pitService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchPit(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['pit', session_key],
    queryFn: () => getPitStops(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}

export function useFetchPitsByDrivers(
  session_key: OpenF1Key,
  drivers: number[]
) {
  const uniqueDriverNumbers = [...new Set(drivers)]
    .filter((driverNumber) => driverNumber > 0)
    .sort((a, b) => a - b);
  return useQuery({
    queryKey: ['pit', session_key, uniqueDriverNumbers],
    queryFn: () => getPitsByDrivers(session_key, uniqueDriverNumbers),
    enabled: isValidOpenF1Key(session_key) && uniqueDriverNumbers.length > 0,
  });
}
