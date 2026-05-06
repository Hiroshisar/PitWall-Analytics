import { useQuery } from '@tanstack/react-query';
import {
  getLatestMeeting,
  getMeetingByKey,
  getMeetingByYear,
  getNextMeeting,
} from '../services/meetingService';
import { isValidOpenF1Key, latestOpenF1Key } from '../utils/helpers';
import type { OpenF1Key } from '../utils/types';

export function useFetchMeetings(year: number) {
  return useQuery({
    queryKey: ['meetings', year],
    queryFn: () => getMeetingByYear(year),
    enabled: Boolean(year),
  });
}

export function useFetchMeetingByKey(key: OpenF1Key = latestOpenF1Key) {
  return useQuery({
    queryKey: ['meeting', key],
    queryFn: () => getMeetingByKey(key),
    enabled: isValidOpenF1Key(key),
  });
}

export function useFetchLatestMeeting(enabled = true) {
  return useQuery({
    queryKey: ['meeting', latestOpenF1Key],
    queryFn: () => getLatestMeeting(),
    enabled,
  });
}

export function useFetchNextMeeting(enabled = true) {
  return useQuery({
    queryKey: ['nextMeeting'],
    queryFn: () => getNextMeeting(),
    enabled,
  });
}
