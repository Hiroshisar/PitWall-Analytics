import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { intervalType } from "../utils/types";
import { notifyServiceError } from "./serviceError";

export async function getDriverIntervals(
  session_key: number,
  driver_number: number,
): Promise<intervalType[]> {
  try {
    const res = await api.get(
      `${endpoints.intervals}?session_key=${session_key}&driver_number=${driver_number}`,
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      `Unable to load car ${driver_number} intervals data`,
      "interval-data-error",
    );

    return [];
  }
}
