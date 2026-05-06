export type carType = {
  brake: number;
  date: string;
  driver_number: number;
  drs: number;
  meeting_key: number;
  n_gear: number;
  rpm: number;
  session_key: number;
  speed: number;
  throttle: number;
};

export type driverStandingsType = {
  driver_number: number;
  meeting_key: number;
  points_current: number;
  points_start: number;
  position_current: number;
  position_start: number;
  session_key: number;
};

export type teamStandingsType = {
  meeting_key: number;
  points_current: number;
  points_start: number;
  position_current: number;
  position_start: number;
  session_key: number;
  team_name: string;
};

export type driverType = {
  broadcast_name: string;
  driver_number: number;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  meeting_key: number;
  name_acronym: string;
  session_key: number;
  team_colour: string;
  team_name: string;
  position?: number;
};

export type intervalType = {
  date: string;
  driver_number: number;
  gap_to_leader: number;
  interval: number;
  meeting_key: number;
  session_key: number;
};

export type lapType = {
  date_start: string;
  driver_number: number;
  duration_sector_1: number;
  duration_sector_2: number;
  duration_sector_3: number;
  i1_speed: number; // car speed at the first intermediate point of the track
  i2_speed: number; // car speed at the second intermediate point of the track
  is_pit_out_lap: boolean;
  lap_duration: number;
  lap_number: number;
  meeting_key: number;
  segments_sector_1: number;
  segments_sector_2: number;
  segments_sector_3: number;
  session_key: number;
  st_speed: number;
};

export type locationType = {
  date: string;
  driver_number: number;
  meeting_key: number;
  session_key: number;
  x: number;
  y: number;
  z: number;
};

export type meetingType = {
  circuit_key: number;
  circuit_info_url: string;
  circuit_image: string;
  circuit_short_name: string;
  circuit_type: string;
  country_code: string;
  country_flag: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  is_cancelled: boolean;
  location: string;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  year: number;
};

export type overtakeType = {
  date: string;
  meeting_key: number;
  overtaken_driver_number: number;
  overtaking_driver_number: number;
  position: number;
  session_key: number;
};

export type pitType = {
  date: string;
  driver_number: number;
  lane_duration: number;
  lap_number: number;
  meeting_key: number;
  pit_duration: number;
  session_key: number;
  stop_duration: number;
};

export type positionType = {
  date: string;
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;
};

export type raceControlType = {
  category: string;
  date: string;
  driver_number: number;
  flag: string;
  lap_number: number;
  meeting_key: number;
  message: string;
  qualifying_phase: number | null;
  scope: string;
  sector: number | null;
  session_key: number;
};

export type sessionType = {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  is_cancelled: boolean;
  location: string;
  meeting_key: number;
  session_key: number;
  session_name: string;
  session_type: string;
  year: number;
};

export type sessionResultType = {
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  driver_number: number;
  duration: number;
  gap_to_leader: number;
  number_of_laps: number;
  meeting_key: number;
  position: number;
  session_key: number;
};

export type startingGridType = {
  position: number;
  driver_number: number;
  lap_duration: number;
  meeting_key: number;
  session_key: number;
};

export type stintType = {
  compound: string;
  driver_number: number;
  lap_end: number;
  lap_start: number;
  meeting_key: number;
  session_key: number;
  stint_number: number;
  tyre_age_at_start: number;
};

export type teamRadioType = {
  date: string;
  driver_number: number;
  meeting_key: number;
  recording_url: string;
  session_key: number;
};

export type weatherType = {
  air_temperature: number;
  date: string;
  humidity: number;
  meeting_key: number;
  pressure: number;
  rainfall: number;
  session_key: number;
  track_temperature: number;
  wind_direction: number;
  wind_speed: number;
};

export type meetingStateType = {
  selectedMeetingKey: number | null;
};

export type sessionStateType = {
  selectedSessionKey: number | null;
};

export type driverStateType = {
  drivers: driverType[];
};

export type TelemetryMetric = 'speed' | 'brake' | 'gear' | 'rpm' | 'throttle';

export type DriverSeriesPoint = {
  lapTimeSec: number;
  value: number;
};

export type DriverSeries = {
  driver: driverType;
  color: string;
  points: DriverSeriesPoint[];
  lapNumber?: number;
  lapDuration?: number;
};

export type LocationSeriesPoint = {
  lapTimeSec: number;
  x: number;
  y: number;
  z: number;
};

export type DriverLocationSeries = {
  driver: driverType;
  color: string;
  points: LocationSeriesPoint[];
};

export type CircuitDataType = {
  key: number;
  info: string;
  image: string;
  short_name: string;
  type: string;
  countryCode: string;
  flag: string;
  countryKey: number;
  countryName: string;
  location: string;
};

export type SelectedLapCarSample = carType & {
  selectedLapNumber?: number;
  selectedLapTime?: number;
};

/**
 *
 * TYPES DELLA TELEMETRIA LIVE
 *
 * NON CANCELLARE E NON TOCCARE
 *
 */

export type TelemetrySample = { t: number; v: number };

export type RingBuffer = {
  capacity: number;
  head: number; // prossimo indice di scrittura
  size: number; // quanti elementi validi
  data: (TelemetrySample | null)[];
  last: TelemetrySample | null;
};

export type ChannelState = {
  id: string;
  ring: RingBuffer;
};

export type TelemetryState = {
  channels: Record<string, ChannelState>;
  lookbackMs: number; // finestra grafico
  uiFps: number; // frequenza rendering desiderata
};
