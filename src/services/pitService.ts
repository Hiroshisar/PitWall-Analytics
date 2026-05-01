import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { pitType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getPitStops(session_key: number): Promise<pitType[]> {
  try {
    const res = await api.get(`${endpoints.pit}?session_key=${session_key}`);

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, 'Unable to load pit data', 'pit-data-error');

    return [];
  }
}
