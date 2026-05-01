import { endpoints } from '../api/endpoints';
import { api } from '../api/telemetryApi';
import type { driverStandingsType, teamStandingsType } from '../utils/types';
import { notifyServiceError } from './serviceError';

export async function getStandings(
  session_key: number
): Promise<{ drivers: driverStandingsType[]; teams: teamStandingsType[] }> {
  let driversRes = [] as driverStandingsType[];
  let teamsRes = [] as teamStandingsType[];

  try {
    const res = await api.get(
      `${endpoints.championship_drivers}?session_key=${session_key}`
    );
    driversRes = res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load drivers championship data',
      'drivers-championship-data-error'
    );

    driversRes = [];
  }

  try {
    const res = await api.get(
      `${endpoints.championship_teams}?session_key=${session_key}`
    );
    teamsRes = res.data;
  } catch (err: unknown) {
    notifyServiceError(
      err,
      'Unable to load teams championship data',
      'teams-championship-data-error'
    );

    teamsRes = [];
  }

  return { drivers: driversRes, teams: teamsRes };
}
