import { useQuery } from '@tanstack/react-query';
import { getAllStints } from '../services/stintService';

export function useFetchStints(session_key: number) {
  return useQuery({
    queryKey: ['stints', session_key],
    queryFn: () => getAllStints(session_key),
    enabled: session_key > 0,
  });
}
