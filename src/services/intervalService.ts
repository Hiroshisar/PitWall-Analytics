import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { IntervalType, OpenF1Key } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getDriverIntervals(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<IntervalType[]> {
  try {
    const res = await api.get(
      `${endpoints.intervals}?session_key=${stringifyOpenF1Key(session_key)}`
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
