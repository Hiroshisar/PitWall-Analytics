import type {
  TeamImageMatcher,
  TeamStandingCardProps,
} from '../utils/types.ts';
import { StyledCardRow, StyledTeamCard } from '../style/styles.ts';

const teamImageMatchers: TeamImageMatcher[] = [
  {
    aliases: ['aston martin', 'aston'],
    carImage: 'teams/cars/aston_martin.png',
    logo: 'teams/logos/aston_martin_logo.png',
  },
  {
    aliases: ['ferrari'],
    carImage: 'teams/cars/ferrari.png',
    logo: 'teams/logos/ferrari_logo.png',
  },
  {
    aliases: ['haas'],
    carImage: 'teams/cars/haas_f1_team.png',
    logo: 'teams/logos/haas_f1_team_logo.png',
  },
  {
    aliases: ['mclaren', 'mc laren'],
    carImage: 'teams/cars/mclaren.png',
    logo: 'teams/logos/mclaren_logo.png',
  },
  {
    aliases: ['mercedes'],
    carImage: 'teams/cars/mercedes.png',
    logo: 'teams/logos/mercedes_logo.png',
  },
  {
    aliases: ['racing bulls', 'vcarb', 'visa cash app', 'rb'],
    carImage: 'teams/cars/racing_bulls.png',
    logo: 'teams/logos/racing_bulls_logo.png',
  },
  {
    aliases: ['red bull', 'oracle'],
    carImage: 'teams/cars/red_bull_racing.png',
    logo: 'teams/logos/red_bull_racing_logo.png',
  },
  {
    aliases: ['williams'],
    carImage: 'teams/cars/williams.png',
    logo: 'teams/logos/williams_logo.png',
  },
  {
    aliases: ['audi', 'sauber', 'kick'],
    carImage: 'teams/cars/audi.png',
    logo: 'teams/logos/audi_logo.png',
  },
  {
    aliases: ['cadillac'],
    carImage: 'teams/cars/cadillac.png',
    logo: 'teams/logos/cadillac_logo.png',
  },
  {
    aliases: ['alpine'],
    carImage: 'teams/cars/alpine.png',
    logo: 'teams/logos/alpine_logo.png',
  },
];

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

const getTeamImageFileName = (teamName: string, type: string) => {
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

const getTeamImageSrc = (teamName: string, type: string) =>
  getPublicImageSrc(getTeamImageFileName(teamName, type));

function TeamStandingCard({ team }: TeamStandingCardProps) {
  const imageSrc = getTeamImageSrc(team.team_name, 'background');

  return (
    <StyledTeamCard $url={imageSrc}>
      <StyledCardRow>
        <img
          src={getTeamImageFileName(team.team_name, 'logo')}
          alt={team.team_name}
        />
        <h3>{team.team_name}</h3>
      </StyledCardRow>
    </StyledTeamCard>
  );
}

export default TeamStandingCard;
