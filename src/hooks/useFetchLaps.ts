import { useQuery } from '@tanstack/react-query';
import { getLaps, getLapsByDrivers } from '../services/lapService';

export function useFetchLaps(session_key: number) {
  return useQuery({
    queryKey: ['laps', session_key],
    queryFn: () => getLaps(session_key),
    enabled: session_key > 0,
  });
}

export function useFetchLapsByDrivers(
  sessionKey: number,
  driverNumbers: number[]
) {
  const uniqueDriverNumbers = [...new Set(driverNumbers)]
    .filter((driverNumber) => driverNumber > 0)
    .sort((a, b) => a - b);

  return useQuery({
    queryKey: ['laps', sessionKey, uniqueDriverNumbers],
    queryFn: () => getLapsByDrivers(sessionKey, uniqueDriverNumbers),
    enabled: sessionKey > 0 && uniqueDriverNumbers.length > 0,
  });
}
