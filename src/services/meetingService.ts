import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { meetingType } from '../utils/types';
import { notifyServiceError } from './serviceError';

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

export async function getMeetingByKey(key: number): Promise<meetingType> {
  try {
    const res = await api.get(`${endpoints.meetings}?meeting_key=${key}`);

    return res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      `Unable to load data for meeting key ${key}`,
      'meeting-data-error'
    );

    return {} as meetingType;
  }
}

export async function getNextMeeting(date: string): Promise<meetingType> {
  try {
    const year = new Date().getFullYear();
    const res = await api.get(
      `${endpoints.meetings}?year=${year}&date_start>${date}`
    );
    return res.data[0];
  } catch (err: unknown) {
    notifyServiceError(
      err,
      `Unable to load data for the next meeting`,
      'meeting-data-error'
    );

    return {} as meetingType;
  }
}
