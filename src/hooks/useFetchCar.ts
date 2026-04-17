import { useQuery } from "@tanstack/react-query";
import { getCar } from "../services/carService";

export function useFetchCar(driver_number: number) {
  return useQuery({
    queryKey: ["car", driver_number],
    queryFn: () => getCar(driver_number),
    enabled: driver_number > 0,
  });
}
