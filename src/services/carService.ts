import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import {
  isValidOpenF1Key,
  latestOpenF1Key,
  stringifyOpenF1Key,
} from '../utils/helpers';
import type { carType, OpenF1Key } from '../utils/types';
import { getHttpStatus, notifyServiceError } from './serviceError';

export async function getCar(
  driver_number: number,
  session_key: OpenF1Key = latestOpenF1Key
): Promise<carType[]> {
  try {
    const res = await api.get(
      `${endpoints.car}?driver_number=${driver_number}&session_key=${stringifyOpenF1Key(session_key)}`
    );
    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, 'Unable to load car data', 'car-data-error');

    return [];
  }
}

export async function getCarsByDrivers(
  driver_numbers: number[],
  session_key: OpenF1Key = latestOpenF1Key
): Promise<carType[]> {
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
    const res = await api.get(`${endpoints.car}?${params.toString()}`);
    return res.data;
  } catch (err: unknown) {
    const status = getHttpStatus(err);

    if (status === 400 || status === 404 || status === 422) {
      const mergedCarsData: carType[] = [];
      let hasFallbackErrors = false;

      for (const driverNumber of uniqueDriverNumbers) {
        try {
          const cars = await getCar(driverNumber, session_key);
          mergedCarsData.push(...cars);
          await new Promise((resolve) => setTimeout(resolve, 120));
        } catch {
          hasFallbackErrors = true;
        }
      }

      if (hasFallbackErrors && mergedCarsData.length === 0) {
        notifyServiceError(
          err,
          'Unable to load car data for selected drivers',
          'cars-data-error'
        );
      }

      return mergedCarsData;
    }

    notifyServiceError(
      err,
      'Unable to load car data for selected drivers',
      'cars-data-error'
    );
    return [];
  }
}
