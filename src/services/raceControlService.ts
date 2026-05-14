import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { OpenF1Key, RaceControlType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getSessionRaceControl(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<RaceControlType[]> {
  try {
    const res = await api.get(
      `${endpoints.race_control}?session_key=${stringifyOpenF1Key(session_key)}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load race control data',
      'race-control-data-error'
    );

    return [];
  }
}
