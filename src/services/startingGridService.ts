import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { OpenF1Key, startingGridType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getStartingGrid(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<startingGridType[]> {
  try {
    const res = await api.get(
      `${endpoints.starting_grid}?session_key=${stringifyOpenF1Key(session_key)}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load starting grid data',
      'starting-grid-data-error'
    );

    return [];
  }
}
