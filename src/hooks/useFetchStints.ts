import { useQuery } from "@tanstack/react-query";
import { getAllDriverStint } from "../services/stintService";

export function useFetchStints(session_key: number, driver_number: number) {
  return useQuery({
    queryKey: ["stints", session_key, driver_number],
    queryFn: () => getAllDriverStint(session_key, driver_number),
    enabled: session_key > 0 && driver_number > 0,
  });
}
