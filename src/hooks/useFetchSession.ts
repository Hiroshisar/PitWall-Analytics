import { useQuery } from '@tanstack/react-query';
import {
  getNextSession,
  getSession,
  getSessions,
} from '../services/sessionService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchAllSessions(meeting_key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['sessions', meeting_key],
    queryFn: () => getSessions(meeting_key),
    enabled: isValidOpenF1Key(meeting_key),
  });
}

export function useFetchSession(
  session_key: OpenF1Key = latestOpenF1Key,
  enabled = true
) {
  return useQuery({
    queryKey: ['session', session_key],
    queryFn: () => getSession(session_key),
    enabled: enabled && isValidOpenF1Key(session_key),
  });
}

export function useFetchLatestSession(enabled = true) {
  return useFetchSession(latestOpenF1Key, enabled);
}

export function useFetchNextSession(enabled = true) {
  return useQuery({
    queryKey: ['next_session'],
    queryFn: () => getNextSession(),
    enabled,
  });
}
