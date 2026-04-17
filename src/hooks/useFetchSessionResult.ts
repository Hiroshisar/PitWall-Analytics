import { useQuery } from "@tanstack/react-query";
import { getSessionResults } from "../services/resultsService";

export function useFetchSessionResult(session_key: number) {
  return useQuery({
    queryKey: ["session-results", session_key],
    queryFn: () => getSessionResults(session_key),
    enabled: session_key > 0,
  });
}
