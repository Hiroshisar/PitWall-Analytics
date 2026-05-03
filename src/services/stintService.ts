import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { stintType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getAllStints(session_key: number): Promise<stintType[]> {
  try {
    const res = await api.get(`${endpoints.stints}?session_key=${session_key}`);

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, 'Unable to load stints data', 'stints-data-error');

    return [];
  }
}
