import { useQuery } from "@tanstack/react-query";
import { getDriverIntervals } from "../services/intervalService";

export function useFetchIntervals(session_key: number, driver_number: number) {
  return useQuery({
    queryKey: ["intervals", session_key, driver_number],
    queryFn: () => getDriverIntervals(session_key, driver_number),
    enabled: session_key > 0 && driver_number > 0,
  });
}
