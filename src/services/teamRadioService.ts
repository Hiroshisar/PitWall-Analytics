import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { OpenF1Key, teamRadioType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getSessionTeamRadio(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<teamRadioType[]> {
  try {
    const res = await api.get(
      `${endpoints.team_radio}?session_key=${stringifyOpenF1Key(session_key)}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load team radio data',
      'team-radio-data-error'
    );

    return [];
  }
}
