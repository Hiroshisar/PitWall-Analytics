import { endpoints } from "../api/endpoints";
import { api } from "../api/telemetry";
import type { driverStandingsType, teamStandingsType } from "../utils/types";
import { Bounce, toast } from "react-toastify";

export async function getStandings(
  session_key: number,
): Promise<{ drivers: driverStandingsType[]; teams: teamStandingsType[] }> {
  let driversRes = [] as driverStandingsType[];
  let teamsRes = [] as teamStandingsType[];

  try {
    driversRes = await api.get(
      `${endpoints.championship_drivers}?session_key=${session_key}`,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.status >= 400)
      toast.error(`Unable to load drivers championship data`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

    driversRes = [];
  }

  try {
    teamsRes = await api.get(
      `${endpoints.championship_teams}?session_key=${session_key}`,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.status >= 400)
      toast.error(`Unable to load drivers championship data`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

    teamsRes = [];
  }

  return { drivers: driversRes, teams: teamsRes };
}
