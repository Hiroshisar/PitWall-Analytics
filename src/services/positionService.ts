import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { positionType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getDriverPosition(
  session_key: number
): Promise<positionType[]> {
  try {
    const res = await api.get(
      `${endpoints.position}?session_key=${session_key}`
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
