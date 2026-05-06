import { useQuery } from '@tanstack/react-query';
import { getLaps, getLapsByDrivers } from '../services/lapService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchLaps(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['laps', session_key],
    queryFn: () => getLaps(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}

export function useFetchLapsByDrivers(
  sessionKey: OpenF1Key,
  driverNumbers: number[]
) {
  const uniqueDriverNumbers = [...new Set(driverNumbers)]
    .filter((driverNumber) => driverNumber > 0)
    .sort((a, b) => a - b);

  return useQuery({
    queryKey: ['laps', sessionKey, uniqueDriverNumbers],
    queryFn: () => getLapsByDrivers(sessionKey, uniqueDriverNumbers),
    enabled: isValidOpenF1Key(sessionKey) && uniqueDriverNumbers.length > 0,
  });
}
