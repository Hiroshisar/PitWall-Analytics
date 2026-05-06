import { useQuery } from '@tanstack/react-query';
import { getSessionWeather } from '../services/weatherService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchWeather(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['weather', session_key],
    queryFn: () => getSessionWeather(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}
