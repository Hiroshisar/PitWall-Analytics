import { useQuery } from "@tanstack/react-query";
import { getAllSessions } from "../services/sessionService";

export function useFetchSessions(meeting_key: number) {
  return useQuery({
    queryKey: ["sessions", meeting_key],
    queryFn: () => getAllSessions(meeting_key),
    enabled: meeting_key > 0,
  });
}
