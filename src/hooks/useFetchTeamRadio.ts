import { useQuery } from '@tanstack/react-query';
import { getSessionTeamRadio } from '../services/teamRadioService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchTeamRadio(session_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['team-radio', session_key],
    queryFn: () => getSessionTeamRadio(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}
