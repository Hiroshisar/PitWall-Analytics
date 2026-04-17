import { useQuery } from "@tanstack/react-query";
import { getStandings } from "../services/standingService";

export function useFetchTeamChampionship(session_key: number) {
  return useQuery({
    queryKey: ["standings", "teams", session_key],
    queryFn: async () => (await getStandings(session_key)).teams,
    enabled: session_key > 0,
  });
}
