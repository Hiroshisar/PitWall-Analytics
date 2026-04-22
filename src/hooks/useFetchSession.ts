import { useQuery } from "@tanstack/react-query";
import { getSessions } from "../services/sessionService";

export function useFetchAllSessions(meeting_key: number) {
  return useQuery({
    queryKey: ["sessions", meeting_key],
    queryFn: () => getSessions(meeting_key),
    enabled: meeting_key > 0,
  });
}
