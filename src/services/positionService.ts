import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { OpenF1Key, PositionType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getDriverPosition(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<PositionType[]> {
  try {
    const res = await api.get(
      `${endpoints.position}?session_key=${stringifyOpenF1Key(session_key)}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load position data',
      'position-data-error'
    );

    return [];
  }
}
