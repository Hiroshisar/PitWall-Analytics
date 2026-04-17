import { useQuery } from "@tanstack/react-query";
import { getSessionRaceControl } from "../services/raceControlService";

export function useFetchRaceControl(session_key: number) {
  return useQuery({
    queryKey: ["race-control", session_key],
    queryFn: () => getSessionRaceControl(session_key),
    enabled: session_key > 0,
  });
}
