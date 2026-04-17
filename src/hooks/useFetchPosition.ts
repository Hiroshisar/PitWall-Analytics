import { useQuery } from "@tanstack/react-query";
import { getDriverPosition } from "../services/positionService";

export function useFetchPosition(session_key: number) {
  return useQuery({
    queryKey: ["position", session_key],
    queryFn: () => getDriverPosition(session_key),
    enabled: session_key > 0,
  });
}
