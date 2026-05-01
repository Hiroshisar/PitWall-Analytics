import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { overtakeType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getOvertakes(
  session_key: number
): Promise<overtakeType[]> {
  try {
    const res = await api.get(
      `${endpoints.overtakes}?session_key=${session_key}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load overtakes data',
      'overtakes-data-error'
    );

    return [];
  }
}
