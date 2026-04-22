import { useQuery } from "@tanstack/react-query";
import { getCar } from "../services/carService";

export function useFetchCar(driver_number: number, session_key: number) {
  return useQuery({
    queryKey: ["car", session_key, driver_number],
    queryFn: () => getCar(driver_number, session_key),
    enabled: driver_number > 0 && session_key > 0,
  });
}
