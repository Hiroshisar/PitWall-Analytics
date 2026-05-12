import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { OpenF1Key, stintType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getAllStints(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<stintType[]> {
  try {
    const res = await api.get(
      `${endpoints.stints}?session_key=${stringifyOpenF1Key(session_key)}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, 'Unable to load stints data', 'stints-data-error');

    return [];
  }
}
