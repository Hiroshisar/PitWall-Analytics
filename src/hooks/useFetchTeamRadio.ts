import { useQuery } from "@tanstack/react-query";
import { getSessionTeamRadio } from "../services/teamRadioService";

export function useFetchTeamRadio(session_key: number) {
  return useQuery({
    queryKey: ["team-radio", session_key],
    queryFn: () => getSessionTeamRadio(session_key),
    enabled: session_key > 0,
  });
}
