import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { OpenF1Key, sessionResultType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getSessionResults(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<sessionResultType[]> {
  try {
    const res = await api.get(
      `${endpoints.session_result}?session_key=${stringifyOpenF1Key(session_key)}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load session results data',
      'session-results-data-error'
    );

    return [];
  }
}
