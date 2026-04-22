import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { weatherType } from "../utils/types";
import { notifyServiceError } from "./serviceError";

export async function getSessionWeather(
  session_key: number,
): Promise<weatherType[]> {
  try {
    const res = await api.get(
      `${endpoints.weather}?session_key=${session_key}`,
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      "Unable to load weather data",
      "weather-data-error",
    );

    return [];
  }
}
