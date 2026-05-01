import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { sessionResultType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getSessionResults(
  session_key: number
): Promise<sessionResultType[]> {
  try {
    const res = await api.get(
      `${endpoints.session_result}?session_key=${session_key}`
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
