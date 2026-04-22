import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { raceControlType } from "../utils/types";
import { notifyServiceError } from "./serviceError";

export async function getSessionRaceControl(
  session_key: number,
): Promise<raceControlType[]> {
  try {
    const res = await api.get(
      `${endpoints.race_control}?session_key=${session_key}`,
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      "Unable to load race control data",
      "race-control-data-error",
    );

    return [];
  }
}
