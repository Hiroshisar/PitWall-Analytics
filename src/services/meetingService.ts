import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { OpenF1Key, MeetingType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getMeetingByYear(year: number): Promise<MeetingType[]> {
  try {
    const today = new Date();

    const res = await api.get(`${endpoints.meetings}?year=${year}`);

    const filteredMeetings = res.data.filter(
      (elem: MeetingType) =>
        new Date(elem.date_start) <= today && !elem.is_cancelled
    );

    return filteredMeetings;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      `Unable to load data for year ${year}`,
      'meeting-data-error'
    );

    return [];
  }
}

export async function getMeetingByKey(
  key: OpenF1Key = latestOpenF1Key
): Promise<MeetingType> {
  try {
    const res = await api.get(
      `${endpoints.meetings}?meeting_key=${stringifyOpenF1Key(key)}`
    );

    return res.data[0] ?? ({} as MeetingType);
  } catch (err: unknown) {
    notifyServiceError(
      err,
      `Unable to load data for meeting key ${key}`,
      'meeting-data-error'
    );

    return {} as MeetingType;
  }
}

export async function getLatestMeeting(): Promise<MeetingType> {
  return getMeetingByKey(latestOpenF1Key);
}

export async function getNextMeeting(): Promise<MeetingType | null> {
  try {
    const now = new Date();

    const res = await api.get(
      `${endpoints.meetings}?date_start>${now.toISOString()}`
    );

    return (
      res.data.filter(
        (elem: MeetingType) =>
          !elem.is_cancelled && new Date(elem.date_start) > now
      )[0] ?? null
    );
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load data for the next meeting',
      'meeting-data-error'
    );

    return {} as MeetingType;
  }
}
