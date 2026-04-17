import { useQuery } from "@tanstack/react-query";
import { getMeeting } from "../services/meetingService";

export function useFetchMeetings(year: number) {
  return useQuery({
    queryKey: ["meetings", year],
    queryFn: () => getMeeting(year),
    enabled: Boolean(year),
  });
}
