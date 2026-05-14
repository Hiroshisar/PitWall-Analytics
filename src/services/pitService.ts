import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import {
  isValidOpenF1Key,
  latestOpenF1Key,
  stringifyOpenF1Key,
} from '../utils/helpers';
import type { OpenF1Key, PitType } from '../utils/types';
import { getHttpStatus, notifyServiceError } from './serviceError';

export async function getPitStops(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<PitType[]> {
  try {
    const res = await api.get(
      `${endpoints.pit}?session_key=${stringifyOpenF1Key(session_key)}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, 'Unable to load pit data', 'pit-data-error');

    return [];
  }
}

export async function getPitsByDrivers(
  session_key: OpenF1Key,
  driver_numbers: number[]
): Promise<PitType[]> {
  const uniqueDriverNumbers = [...new Set(driver_numbers)].filter(
    (driverNumber) => driverNumber > 0
  );

  if (!isValidOpenF1Key(session_key) || uniqueDriverNumbers.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    session_key: stringifyOpenF1Key(session_key),
  });
  uniqueDriverNumbers.forEach((driverNumber) => {
    params.append('driver_number', String(driverNumber));
  });

  try {
    const res = await api.get(`${endpoints.pit}?${params.toString()}`);
    return res.data;
  } catch (err: unknown) {
    const status = getHttpStatus(err);

    if (status === 400 || status === 404 || status === 422) {
      const mergedPitsData: PitType[] = [];
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
