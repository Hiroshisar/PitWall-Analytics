import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { OpenF1Key, sessionType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getSessions(
  meeting_key: OpenF1Key = latestOpenF1Key
): Promise<sessionType[]> {
  try {
    const today = new Date();

    const res = await api.get(
      `${endpoints.sessions}?meeting_key=${stringifyOpenF1Key(meeting_key)}`
    );

    const filteredSessions = res.data.filter(
      (elem: sessionType) => new Date(elem.date_start) <= today
    );

    return filteredSessions;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load data for this weekend',
      'session-data-error'
    );

    return [];
  }
}

export async function getSession(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<sessionType | null> {
  try {
    const res = await api.get(
      `${endpoints.sessions}?session_key=${stringifyOpenF1Key(session_key)}`
    );

    return res.data[0] ?? null;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load session data',
      'session-data-error'
    );

    return null;
  }
}

export async function getLatestSession(): Promise<sessionType | null> {
  return getSession(latestOpenF1Key);
}

export async function getNextSession(): Promise<sessionType | null> {
  try {
    const now = new Date();

    const res = await api.get(endpoints.sessions);

    return (
      res.data
        .filter(
          (elem: sessionType) =>
            !elem.is_cancelled && new Date(elem.date_start) > now
        )
        .sort(
          (sessionA: sessionType, sessionB: sessionType) =>
            new Date(sessionA.date_start).getTime() -
            new Date(sessionB.date_start).getTime()
        )[0] ?? null
    );
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load the next session',
      'next-session-data-error'
    );

    return null;
  }
}
