import { useQuery } from '@tanstack/react-query';
import { getPitsByDrivers, getPitStops } from '../services/pitService';

export function useFetchPit(session_key: number) {
  return useQuery({
    queryKey: ['pit', session_key],
    queryFn: () => getPitStops(session_key),
    enabled: session_key > 0,
  });
}

export function useFetchPitsByDrivers(session_key: number, drivers: number[]) {
  const uniqueDriverNumbers = [...new Set(drivers)]
    .filter((driverNumber) => driverNumber > 0)
    .sort((a, b) => a - b);
  return useQuery({
    queryKey: ['pit', session_key, uniqueDriverNumbers],
    queryFn: () => getPitsByDrivers(session_key, uniqueDriverNumbers),
    enabled: session_key > 0 && uniqueDriverNumbers.length > 0,
  });
}
