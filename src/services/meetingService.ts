import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import { latestOpenF1Key, stringifyOpenF1Key } from '../utils/helpers';
import type { meetingType, OpenF1Key } from '../utils/types';
import { notifyServiceError } from './serviceError';
import { getNextSession } from './sessionService';

export async function getMeetingByYear(year: number): Promise<meetingType[]> {
  try {
    const today = new Date();

    const res = await api.get(`${endpoints.meetings}?year=${year}`);

    const filteredMeetings = res.data.filter(
      (elem: meetingType) =>
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
): Promise<meetingType> {
  try {
    const res = await api.get(
      `${endpoints.meetings}?meeting_key=${stringifyOpenF1Key(key)}`
    );

    return res.data[0] ?? ({} as meetingType);
  } catch (err: unknown) {
    notifyServiceError(
      err,
      `Unable to load data for meeting key ${key}`,
      'meeting-data-error'
    );

    return {} as meetingType;
  }
}

export async function getLatestMeeting(): Promise<meetingType> {
  return getMeetingByKey(latestOpenF1Key);
}

export async function getNextMeeting(): Promise<meetingType> {
  try {
    const nextSession = await getNextSession();
    if (!nextSession) return {} as meetingType;

    return getMeetingByKey(nextSession.meeting_key);
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load data for the next meeting',
      'meeting-data-error'
    );

    return {} as meetingType;
  }
}
