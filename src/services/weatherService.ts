import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { OpenF1Key, weatherType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getSessionWeather(
  session_key: OpenF1Key = latestOpenF1Key
): Promise<weatherType[]> {
  try {
    const res = await api.get(
      `${endpoints.weather}?session_key=${stringifyOpenF1Key(session_key)}`
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load weather data',
      'weather-data-error'
    );

    return [];
  }
}
