import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { DriverType, OpenF1Key } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getDrivers(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<DriverType[]> {
  try {
    const res = await api.get(
      `${endpoints.drivers}?session_key=${stringifyOpenF1Key(session_key)}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, 'Unable to load driver data', 'driver-data-error');

    return [];
  }
}
