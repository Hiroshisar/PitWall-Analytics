import type { OpenF1Key, TeamImageMatcher } from './types';

export const latestOpenF1Key = 'latest' as const;

export function isValidOpenF1Key(key: OpenF1Key | null | undefined) {
  return key === latestOpenF1Key || (typeof key === 'number' && key > 0);
}

export function stringifyOpenF1Key(key: OpenF1Key) {
  return String(key);
}

export function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('it', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function formatLapTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '';

  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const minutes = Math.floor(totalMs / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

export function normalizeHexColor(color?: string): string | null {
  if (!color) return null;

  const trimmedColor = color.trim();
  if (!trimmedColor) return null;

  return trimmedColor.startsWith('#') ? trimmedColor : `#${trimmedColor}`;
}

export function checkIfIsLiveSession(
  dateStart: string,
  dateEnd: string
): boolean {
  const startLiveSessionGracePeriodMs = 5 * 60 * 1000;
  const endLiveSessionGracePeriodMs = 20 * 60 * 1000;
  const now = new Date().getTime();
  const start = new Date(dateStart).getTime() + startLiveSessionGracePeriodMs;
  const end = new Date(dateEnd).getTime() + endLiveSessionGracePeriodMs;

  return now >= start && now <= end;
}

export function formatNextSessionTime(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const days = Math.floor(totalSeconds / 86400);
  const hrs = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${days > 1 ? `${days.toString()} days and ` : ''} ${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} hours`;
}

export function formatHours(date: string): string {
  const dateItem = new Date(date);
  const hrs = dateItem.getHours();
  const mins = dateItem.getMinutes();

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export const fallbackDriverImage = () =>
  getPublicImageSrc('drivers/unknown.png');

export const getDriverImageSrc = (driverNumber: number): string =>
  getPublicImageSrc(`drivers/${driverNumber}.png`);

const getPublicImageSrc = (fileName: string) =>
  `${import.meta.env.BASE_URL}${fileName}`;

const normalizeTeamName = (teamName: string) =>
  teamName
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const getTeamImageFileName = (teamName: string, type: string) => {
  const teamImageMatchers: TeamImageMatcher[] = [
    {
      aliases: ['aston martin', 'aston'],
      carImage: 'cars/aston_martin.png',
      logo: 'logos/aston_martin_logo.png',
    },
    {
      aliases: ['ferrari'],
      carImage: 'cars/ferrari.png',
      logo: 'logos/ferrari_logo.png',
    },
    {
      aliases: ['haas'],
      carImage: 'cars/haas_f1_team.png',
      logo: 'logos/haas_f1_team_logo.png',
    },
    {
      aliases: ['mclaren', 'mc laren'],
      carImage: 'cars/mclaren.png',
      logo: 'logos/mclaren_logo.png',
    },
    {
      aliases: ['mercedes'],
      carImage: 'cars/mercedes.png',
      logo: 'logos/mercedes_logo.png',
    },
    {
      aliases: ['racing bulls', 'vcarb', 'visa cash app', 'rb'],
      carImage: 'cars/racing_bulls.png',
      logo: 'logos/racing_bulls_logo.png',
    },
    {
      aliases: ['red bull', 'oracle'],
      carImage: 'cars/red_bull_racing.png',
      logo: 'logos/red_bull_racing_logo.png',
    },
    {
      aliases: ['williams'],
      carImage: 'cars/williams.png',
      logo: 'logos/williams_logo.png',
    },
    {
      aliases: ['audi', 'sauber', 'kick'],
      carImage: 'cars/audi.png',
      logo: 'logos/audi_logo.png',
    },
    {
      aliases: ['cadillac'],
      carImage: 'cars/cadillac.png',
      logo: 'logos/cadillac_logo.png',
    },
    {
      aliases: ['alpine'],
      carImage: 'cars/alpine.png',
      logo: 'logos/alpine_logo.png',
    },
  ];

  const normalizedTeamName = normalizeTeamName(teamName);

  switch (type) {
    case 'background':
      return (
        teamImageMatchers.find(({ aliases }) =>
          aliases.some((alias) => normalizedTeamName.includes(alias))
        )?.carImage ?? 'unknown_team.png'
      );
    case 'logo':
      return (
        teamImageMatchers.find(({ aliases }) =>
          aliases.some((alias) => normalizedTeamName.includes(alias))
        )?.logo ?? ''
      );
    default:
      return '';
  }
};

export const getTeamImageSrc = (teamName: string, type: string) =>
  getPublicImageSrc(`teams/${getTeamImageFileName(teamName, type)}`);
