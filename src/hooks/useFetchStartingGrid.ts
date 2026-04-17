import { useQuery } from "@tanstack/react-query";
import { getStartingGrid } from "../services/startingGridService";

export function useFetchStartingGrid(session_key: number) {
  return useQuery({
    queryKey: ["starting-grid", session_key],
    queryFn: () => getStartingGrid(session_key),
    enabled: session_key > 0,
  });
}
