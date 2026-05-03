import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { pitType } from '../utils/types';
import { getHttpStatus, notifyServiceError } from './serviceError';

export async function getPitStops(session_key: number): Promise<pitType[]> {
  try {
    const res = await api.get(`${endpoints.pit}?session_key=${session_key}`);

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, 'Unable to load pit data', 'pit-data-error');

    return [];
  }
}

export async function getPitsByDrivers(
  session_key: number,
  driver_numbers: number[]
): Promise<pitType[]> {
  const uniqueDriverNumbers = [...new Set(driver_numbers)].filter(
    (driverNumber) => driverNumber > 0
  );

  if (session_key <= 0 || uniqueDriverNumbers.length === 0) return [];

  const params = new URLSearchParams({ session_key: String(session_key) });
  uniqueDriverNumbers.forEach((driverNumber) => {
    params.append('driver_number', String(driverNumber));
  });

  try {
    const res = await api.get(`${endpoints.pit}?${params.toString()}`);
    return res.data;
  } catch (err: unknown) {
    const status = getHttpStatus(err);

    if (status === 400 || status === 404 || status === 422) {
      const mergedPitsData: pitType[] = [];
      let hasFallbackErrors = false;

      try {
        const pits = await getPitStops(session_key);
        mergedPitsData.push(
          ...pits.filter((pit) =>
            uniqueDriverNumbers.includes(pit.driver_number)
          )
        );
      } catch {
        hasFallbackErrors = true;
      }

      if (hasFallbackErrors && mergedPitsData.length === 0) {
        notifyServiceError(
          err,
          'Unable to load pit data for selected drivers',
          'pits-data-error'
        );
      }

      return mergedPitsData;
    }

    notifyServiceError(
      err,
      'Unable to load pit data for selected drivers',
      'pits-data-error'
    );
    return [];
  }
}
