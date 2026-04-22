import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { sessionType } from "../utils/types";
import { notifyServiceError } from "./serviceError";

export async function getSessions(meeting_key: number): Promise<sessionType[]> {
  try {
    const today = new Date();

    const res = await api.get(
      `${endpoints.sessions}?meeting_key=${meeting_key}`,
    );

    const filteredSessions = res.data.filter(
      (elem: sessionType) => new Date(elem.date_start) <= today,
    );

    return filteredSessions;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      "Unable to load data for this weekend",
      "session-data-error",
    );

    return [];
  }
}
