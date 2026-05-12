import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { OpenF1Key, overtakeType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getOvertakes(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<overtakeType[]> {
  try {
    const res = await api.get(
      `${endpoints.overtakes}?session_key=${stringifyOpenF1Key(session_key)}`
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
