import { useQuery } from "@tanstack/react-query";
import { getSessionWeather } from "../services/weatherService";

export function useFetchWeather(session_key: number) {
  return useQuery({
    queryKey: ["weather", session_key],
    queryFn: () => getSessionWeather(session_key),
    enabled: session_key > 0,
  });
}
