import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { carType } from '../utils/types';
import { getHttpStatus, notifyServiceError } from './serviceError';

export async function getCar(
  driver_number: number,
  session_key: number
): Promise<carType[]> {
  try {
    const res = await api.get(
      `${endpoints.car}?driver_number=${driver_number}&session_key=${session_key}`
    );
    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, 'Unable to load car data', 'car-data-error');

    return [];
  }
}

export async function getCarsByDrivers(
  driver_numbers: number[],
  session_key: number
): Promise<carType[]> {
  const uniqueDriverNumbers = [...new Set(driver_numbers)].filter(
    (driverNumber) => driverNumber > 0
  );

  if (session_key <= 0 || uniqueDriverNumbers.length === 0) return [];

  const params = new URLSearchParams({ session_key: String(session_key) });
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
