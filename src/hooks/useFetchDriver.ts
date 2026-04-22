import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "../services/driverService";

export function useFetchDrivers(session_key: number) {
  return useQuery({
    queryKey: ["driver", session_key],
    queryFn: () => getDrivers(session_key),
    enabled: session_key > 0,
  });
}
