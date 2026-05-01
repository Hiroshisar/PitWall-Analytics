export const BASE_URL = "https://api.openf1.org";
export const WEBSOCKET_URL = "wss://mqtt.openf1.org:8084/mqtt";

export const endpoints = {
  car: `${BASE_URL}/v1/car_data`,
  drivers: `${BASE_URL}/v1/drivers`,
  intervals: `${BASE_URL}/v1/intervals`,
  laps: `${BASE_URL}/v1/laps`,
  location: `${BASE_URL}/v1/location`,
  meetings: `${BASE_URL}/v1/meetings`,
  overtakes: `${BASE_URL}/v1/overtakes`,
  pit: `${BASE_URL}/v1/pit`,
  position: `${BASE_URL}/v1/position`,
  race_control: `${BASE_URL}/v1/race_control`,
  sessions: `${BASE_URL}/v1/sessions`,
  session_result: `${BASE_URL}/v1/session_result`,
  starting_grid: `${BASE_URL}/v1/starting_grid`,
  stints: `${BASE_URL}/v1/stints`,
  team_radio: `${BASE_URL}/v1/team_radio`,
  weather: `${BASE_URL}/v1/weather`,
  championship_drivers: `${BASE_URL}/v1/championship_drivers`,
  championship_teams: `${BASE_URL}/v1/championship_teams`,
};
