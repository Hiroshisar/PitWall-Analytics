import { useQuery } from '@tanstack/react-query';
import { getSessionRaceControl } from '../services/raceControlService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchRaceControl(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['race-control', session_key],
    queryFn: () => getSessionRaceControl(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}
