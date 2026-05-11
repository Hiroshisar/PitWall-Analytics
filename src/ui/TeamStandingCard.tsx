import type {
  TeamImageMatcher,
  TeamStandingCardProps,
} from '../utils/types.ts';
import { StyledCardRow, StyledTeamCard } from '../style/styles.ts';

const teamImageMatchers: TeamImageMatcher[] = [
  {
    aliases: ['aston martin', 'aston'],
    carImage: 'aston_martin.png',
    logo: 'aston_martin_logo.png',
  },
  {
    aliases: ['ferrari'],
    carImage: 'ferrari.png',
    logo: 'ferrari_logo.png',
  },
  {
    aliases: ['haas'],
    carImage: 'haas_f1_team.png',
    logo: 'haas_f1_team_logo.png',
  },
  {
    aliases: ['mclaren', 'mc laren'],
    carImage: 'mclaren.png',
    logo: 'mclaren_logo.png',
  },
  {
    aliases: ['mercedes'],
    carImage: 'mercedes.png',
    logo: 'mercedes_logo.png',
  },
  {
    aliases: ['racing bulls', 'vcarb', 'visa cash app', 'rb'],
    carImage: 'racing_bulls.png',
    logo: 'racing_bulls_logo.png',
  },
  {
    aliases: ['red bull', 'oracle'],
    carImage: 'red_bull_racing.png',
    logo: 'red_bull_racing_logo.png',
  },
  {
    aliases: ['williams'],
    carImage: 'williams.png',
    logo: 'williams_logo.png',
  },
  {
    aliases: ['audi', 'sauber', 'kick'],
    carImage: 'audi.png',
    logo: 'audi_logo.png',
  },
  {
    aliases: ['cadillac'],
    carImage: 'cadillac.png',
    logo: 'cadillac_logo.png',
  },
  {
    aliases: ['alpine'],
    carImage: 'alpine.png',
    logo: 'alpine_logo.png',
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
