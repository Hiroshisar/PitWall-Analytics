import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { startingGridType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getStartingGrid(
  session_key: number
): Promise<startingGridType[]> {
  try {
    const res = await api.get(
      `${endpoints.starting_grid}?session_key=${session_key}`
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
