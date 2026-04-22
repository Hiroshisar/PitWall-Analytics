import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { lapType } from "../utils/types";
import { notifyServiceError } from "./serviceError";

export async function getLaps(
  session_key: number,
  driver_number: number,
): Promise<lapType[]> {
  try {
    const res = await api.get(
      `${endpoints.laps}?session_key=${session_key}&driver_number=${driver_number}`,
    );
    console.log(res.data);
    return res.data;
  } catch (err: unknown) {
    notifyServiceError(err, "Unable to load laps data", "laps-data-error");

    return [];
  }
}
