import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { sessionType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getSessions(meeting_key: number): Promise<sessionType[]> {
  try {
    const today = new Date();

    const res = await api.get(
      `${endpoints.sessions}?meeting_key=${meeting_key}`
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

export async function getNextSession(): Promise<sessionType | null> {
  try {
    const now = new Date();

    const res = await api.get(endpoints.sessions);

    const nextSession =
      res.data
        .filter(
          (elem: sessionType) =>
            !elem.is_cancelled && new Date(elem.date_start) > now
        )
        .sort(
          (sessionA: sessionType, sessionB: sessionType) =>
            new Date(sessionA.date_start).getTime() -
            new Date(sessionB.date_start).getTime()
        )[0] ?? null;

    return nextSession;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load the next session',
      'next-session-data-error'
    );

    return null;
  }
}
