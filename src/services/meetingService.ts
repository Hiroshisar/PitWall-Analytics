import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { meetingType } from "../utils/types";
import { notifyServiceError } from "./serviceError";

export async function getMeeting(year: number): Promise<meetingType[]> {
  try {
    const today = new Date();

    const res = await api.get(`${endpoints.meetings}?year=${year}`);

    const filteredMeetings = res.data.filter(
      (elem: meetingType) =>
        new Date(elem.date_start) <= today && !elem.is_cancelled,
    );

    return filteredMeetings;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      `Unable to load data for year ${year}`,
      "meeting-data-error",
    );

    return [];
  }
}
