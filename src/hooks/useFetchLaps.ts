import { useQuery } from "@tanstack/react-query";
import { getLaps } from "../services/lapService";

export function useFetchLaps(session_key: number, driver_number: number) {
  return useQuery({
    queryKey: ["laps", session_key],
    queryFn: () => getLaps(session_key, driver_number),
    enabled: session_key > 0,
  });
}
