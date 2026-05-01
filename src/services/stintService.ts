import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { stintType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getAllDriverStint(
  session_key: number,
  driver_number: number
): Promise<stintType[]> {
  try {
    const res = await api.get(
      `${endpoints.stints}?session_key=${session_key}&driver_number=${driver_number}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, 'Unable to load stints data', 'stints-data-error');

    return [];
  }
}
