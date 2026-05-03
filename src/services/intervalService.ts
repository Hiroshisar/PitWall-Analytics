import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { intervalType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getDriverIntervals(
  session_key: number
): Promise<intervalType[]> {
  try {
    const res = await api.get(
      `${endpoints.intervals}?session_key=${session_key}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      `Unable to load intervals data`,
      'interval-data-error'
    );

    return [];
  }
}
