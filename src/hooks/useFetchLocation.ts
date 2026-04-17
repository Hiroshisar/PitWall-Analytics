import { useQuery } from "@tanstack/react-query";
import { getDriverLocation } from "../services/locationService";

export function useFetchLocation(session_key: number, driver_number: number) {
  return useQuery({
    queryKey: ["location", session_key, driver_number],
    queryFn: () => getDriverLocation(session_key, driver_number),
    enabled: session_key > 0 && driver_number > 0,
  });
}
