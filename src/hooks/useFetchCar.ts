import { useQuery } from '@tanstack/react-query';
import { getCar } from '../services/carService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchCar(
  driver_number: number,
  session_key: OpenF1Key = latestOpenF1Key
) {
  return useQuery({
    queryKey: ['car', session_key, driver_number],
    queryFn: () => getCar(driver_number, session_key),
    enabled: driver_number > 0 && isValidOpenF1Key(session_key),
  });
}
