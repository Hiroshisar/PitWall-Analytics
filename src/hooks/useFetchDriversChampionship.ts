import { useQuery } from "@tanstack/react-query";
import { getStandings } from "../services/standingService";

export function useFetchDriversChampionship(session_key: number) {
  return useQuery({
    queryKey: ["standings", "drivers", session_key],
    queryFn: async () => (await getStandings(session_key)).drivers,
    enabled: session_key > 0,
  });
}
