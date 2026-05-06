import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { isValidOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { locationType, OpenF1Key } from '../utils/types';
import { getHttpStatus, notifyServiceError } from './serviceError';

export async function getDriverLocation(
  session_key: OpenF1Key,
  driver_number: number
): Promise<locationType[]> {
  try {
    const res = await api.get(
      `${endpoints.location}?session_key=${stringifyOpenF1Key(session_key)}&driver_number=${driver_number}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      `Unable to load car ${driver_number} location data`,
      'location-data-error'
    );

    return [];
  }
}

export async function getLocationsByDrivers(
  session_key: OpenF1Key,
  driver_numbers: number[]
): Promise<locationType[]> {
  const uniqueDriverNumbers = [...new Set(driver_numbers)].filter(
    (driverNumber) => driverNumber > 0
  );

  if (!isValidOpenF1Key(session_key) || uniqueDriverNumbers.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    session_key: stringifyOpenF1Key(session_key),
  });
  uniqueDriverNumbers.forEach((DriverNumber) => {
    params.append('driver_number', String(DriverNumber));
  });

  try {
    const res = await api.get(`${endpoints.location}?${params.toString()}`);

    return res.data;
  } catch (err: unknown) {
    const status = getHttpStatus(err);

    if (status === 400 || status === 404 || status === 422) {
      const mergedLocationsData: locationType[] = [];
      let hasFallbackErrors = false;

      for (const driverNumber of uniqueDriverNumbers) {
        try {
          const locations = await getDriverLocation(session_key, driverNumber);
          mergedLocationsData.push(...locations);
          await new Promise((resolve) => setTimeout(resolve, 120));
        } catch {
          hasFallbackErrors = true;
        }
      }

      if (hasFallbackErrors && mergedLocationsData.length === 0) {
        notifyServiceError(
          err,
          'Unable to load location data for selected drivers',
          'location-data-error'
        );
      }

      return mergedLocationsData;
    }

    notifyServiceError(
      err,
      'Unable to load location data for selected drivers',
      'location-data-error'
    );
    return [];
  }
}
