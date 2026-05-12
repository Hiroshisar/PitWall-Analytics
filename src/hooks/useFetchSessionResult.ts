import { useQuery } from '@tanstack/react-query';
import { getSessionResults } from '../services/resultsService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchSessionResult(
  session_key: OpenF1Key = latestOpenF1Key
) {
  return useQuery({
    queryKey: ['session-results', session_key],
    queryFn: () => getSessionResults(session_key),
    enabled: isValidOpenF1Key(session_key),
  });
}
