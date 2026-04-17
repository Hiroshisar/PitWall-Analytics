import { useQuery } from "@tanstack/react-query";
import { getOvertakes } from "../services/overtakeService";

export function useFetchOvertakes(session_key: number) {
  return useQuery({
    queryKey: ["overtakes", session_key],
    queryFn: () => getOvertakes(session_key),
    enabled: session_key > 0,
  });
}
