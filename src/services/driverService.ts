import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { driverType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getDrivers(session_key: number): Promise<driverType[]> {
  try {
    const res = await api.get(
      `${endpoints.drivers}?session_key=${session_key}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, 'Unable to load driver data', 'driver-data-error');

    return [];
  }
}
