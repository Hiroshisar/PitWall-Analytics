import { useQuery } from "@tanstack/react-query";
import { getPitStops } from "../services/pitService";

export function useFetchPit(session_key: number) {
  return useQuery({
    queryKey: ["pit", session_key],
    queryFn: () => getPitStops(session_key),
    enabled: session_key > 0,
  });
}
