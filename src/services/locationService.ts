import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { locationType } from "../utils/types";
import { notifyServiceError } from "./serviceError";

export async function getDriverLocation(
  session_key: number,
  driver_number: number,
): Promise<locationType[]> {
  try {
    const res = await api.get(
      `${endpoints.location}?session_key=${session_key}&driver_number=${driver_number}`,
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      `Unable to load car ${driver_number} location data`,
      "location-data-error",
    );

    return [];
  }
}
