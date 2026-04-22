import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { teamRadioType } from "../utils/types";
import { notifyServiceError } from "./serviceError";

export async function getSessionTeamRadio(
  session_key: number,
): Promise<teamRadioType[]> {
  try {
    const res = await api.get(
      `${endpoints.team_radio}?session_key=${session_key}`,
    );

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      "Unable to load team radio data",
      "team-radio-data-error",
    );

    return [];
  }
}
