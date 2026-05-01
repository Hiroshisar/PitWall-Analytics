export const BASE_URL =
  import.meta.env.VITE_OPENF1_API_BASE_URL?.trim() || '/openf1';
export const WEBSOCKET_URL = "wss://mqtt.openf1.org:8084/mqtt";

export const endpoints = {
  car: '/v1/car_data',
  drivers: '/v1/drivers',
  intervals: '/v1/intervals',
  laps: '/v1/laps',
  location: '/v1/location',
  meetings: '/v1/meetings',
  overtakes: '/v1/overtakes',
  pit: '/v1/pit',
  position: '/v1/position',
  race_control: '/v1/race_control',
  sessions: '/v1/sessions',
  session_result: '/v1/session_result',
  starting_grid: '/v1/starting_grid',
  stints: '/v1/stints',
  team_radio: '/v1/team_radio',
  weather: '/v1/weather',
  championship_drivers: '/v1/championship_drivers',
  championship_teams: '/v1/championship_teams',
};
