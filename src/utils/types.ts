import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type CarType = {
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

export type DriverStandingsType = {
  driver_number: number;
  meeting_key: number;
  points_current: number;
  points_start: number;
  position_current: number;
  position_start: number;
  session_key: number;
};

export type TeamStandingsType = {
  meeting_key: number;
  points_current: number;
  points_start: number;
  position_current: number;
  position_start: number;
  session_key: number;
  team_name: string;
};

export type DriverType = {
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

export type IntervalType = {
  date: string;
  driver_number: number;
  gap_to_leader: number;
  interval: number;
  meeting_key: number;
  session_key: number;
};

export type LapType = {
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

export type LocationType = {
  date: string;
  driver_number: number;
  meeting_key: number;
  session_key: number;
  x: number;
  y: number;
  z: number;
};

export type MeetingType = {
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

export type OvertakeType = {
  date: string;
  meeting_key: number;
  overtaken_driver_number: number;
  overtaking_driver_number: number;
  position: number;
  session_key: number;
};

export type PitType = {
  date: string;
  driver_number: number;
  lane_duration: number;
  lap_number: number;
  meeting_key: number;
  pit_duration: number;
  session_key: number;
  stop_duration: number;
};

export type PositionType = {
  date: string;
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;
};

export type RaceControlType = {
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

export type SessionType = {
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

export type SessionResultType = {
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

export type StartingGridType = {
  position: number;
  driver_number: number;
  lap_duration: number;
  meeting_key: number;
  session_key: number;
};

export type StintType = {
  compound: string;
  driver_number: number;
  lap_end: number;
  lap_start: number;
  meeting_key: number;
  session_key: number;
  stint_number: number;
  tyre_age_at_start: number;
};

export type TeamRadioType = {
  date: string;
  driver_number: number;
  meeting_key: number;
  recording_url: string;
  session_key: number;
};

export type WeatherType = {
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

export type OpenF1Key = number | 'latest';

export type TelemetryMetric = 'speed' | 'brake' | 'gear' | 'rpm' | 'throttle';

export type DriverSeriesPoint = {
  lapTimeSec: number;
  value: number;
};

export type DriverSeries = {
  driver: DriverType;
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
  driver: DriverType;
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

export type SelectedLapCarSample = CarType & {
  selectedLapNumber?: number;
  selectedLapTime?: number;
};

export type ListVariant = 'main' | 'secondary';

export type LoadedDriverImage = {
  driverNumber: number;
  src: string;
};

export type DriverProps = {
  type?: ListVariant;
  driver: DriverType;
  isItemSelected: boolean;
  onRemove?: (driverNumber: number) => void;
  onColorChange?: (driverNumber: number, color: string) => void;
};

export type DriversListProps = {
  drivers: DriverType[];
  selectedDrivers?: DriverType[];
  type?: ListVariant;
  onSelect: (drivers: DriverType[]) => void;
  onOpen?: (value: boolean) => void;
};

export type TeamType = {
  team_name: string;
  team_colour: string;
  team_drivers: DriverType[];
  car_image: string;
  logo: string;
};

export type TeamProps = {
  type?: ListVariant;
  team: TeamType;
  isItemSelected: boolean;
  onRemove?: (teamName: string) => void;
};

export type TeamsListProps = {
  teams: TeamType[];
  selectedTeams?: TeamType[];
  type?: ListVariant;
  onSelect: (teams: TeamType[]) => void;
  onOpen?: (value: boolean) => void;
};

export type DriverBestLapProps = {
  laps: LapType[];
};

export type DriverLastLapProps = {
  laps: LapType[];
};

export type DriverTagProps = {
  driverTag: string;
  position: number;
  color?: string;
};

export type FlagProps = {
  race_control: RaceControlType;
};

export type IntervalProps = {
  intervals: IntervalType[];
};

export type PitProps = {
  pits: PitType[];
};

export type TimerProps = {
  dateEnd: string;
};

export type TyresProps = {
  stints: StintType[];
};

export type PositionProps = {
  isRace: boolean;
  driver: DriverType;
  laps: LapType[];
  pits: PitType[];
  stints: StintType[];
  intervals: IntervalType[];
};

export type RaceControlProps = {
  raceControl: RaceControlType[];
};

export type SessionProps = {
  selectedLap?: number;
  maxNumberOfLaps?: number;
  session?: SessionType;
  meeting?: MeetingType;
  meetings?: MeetingType[];
  sessions?: SessionType[];
  selectedMeetingKey?: number | null;
  selectedSessionKey?: number | null;
  setSelectedLap?: (lap: number) => void;
  onMeetingSelect?: (meetingKey: number) => void;
  onSessionSelect?: (sessionKey: number) => void;
};

export type SessionGridProps = {
  session: SessionType;
  sessionKey?: OpenF1Key;
};

export type ImageSize = {
  width: number;
  height: number;
};

export type CoordinateBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type MapProps = {
  sessionKey: OpenF1Key;
  meetingKey: number;
};

export type TelemetryField = 'speed' | 'brake' | 'n_gear' | 'rpm' | 'throttle';
export type LineType = 'monotone' | 'stepAfter';
export type YAxisDomain = [number | string, number | string];

export type TelemetryMetricConfig = {
  field: TelemetryField;
  label: string;
  yAxisLabel: string;
  lineType: LineType;
  interpolate: boolean;
  yAxisDomain?: YAxisDomain;
  normalizeValue?: (value: number) => number;
  formatValue: (value: number) => string;
};

export type ChartProps = {
  carsData: SelectedLapCarSample[];
  selectedDrivers: DriverType[];
  metric?: TelemetryMetric;
};

export type CustomTelemetryTooltipProps = {
  active?: boolean;
  label?: number | string;
  telemetryData: DriverSeries[];
  metricConfig: TelemetryMetricConfig;
};

type ButtonTypes = 'button' | 'link' | 'close' | 'remove' | 'confirm';

export type ButtonProps = {
  to?: string;
  type: ButtonTypes;
  children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export type LogoProps = {
  redirect: string;
};

export type SelectProps = {
  value: number;
  meetings?: MeetingType[];
  sessions?: SessionType[];
  max?: number;
  onSelect: (value: number) => void;
};

export type ModalProps = {
  drivers?: DriverType[];
  teams?: TeamType[];
  selectedDrivers?: DriverType[];
  selectedTeams?: TeamType[];
  onSelect: ((drivers: DriverType[]) => void) | ((teams: TeamType[]) => void);
  onClose: () => void;
};

export type DriverStandingCardProps = {
  driver: DriverType;
};

export type TeamImageMatcher = {
  aliases: string[];
  carImage: string;
  logo: string;
};

export type TeamStandingCardProps = {
  teamStandings?: TeamStandingsType;
  team?: TeamType;
};

export type WeatherItemProps = {
  data: WeatherType;
};
