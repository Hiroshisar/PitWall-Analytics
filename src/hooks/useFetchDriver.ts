import { useQuery } from "@tanstack/react-query";
import { getDriver } from "../services/driverService";

export function useFetchDriver(driver_number: number) {
  return useQuery({
    queryKey: ["driver", driver_number],
    queryFn: () => getDriver(driver_number),
    enabled: driver_number > 0,
  });
}
