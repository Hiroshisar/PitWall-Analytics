import styled from 'styled-components';
import type { teamStandingsType } from '../utils/types.ts';
import { StyledDriverRow } from '../style/styles.ts';

const teamImageMatchers: { aliases: string[]; fileName: string }[] = [
  { aliases: ['aston martin', 'aston'], fileName: 'aston martin.png' },
  { aliases: ['ferrari'], fileName: 'ferrari.png' },
  { aliases: ['haas'], fileName: 'haas f1 team.png' },
  { aliases: ['mclaren', 'mc laren'], fileName: 'mclaren.png' },
  { aliases: ['mercedes'], fileName: 'mercedes.png' },
  {
    aliases: ['racing bulls', 'vcarb', 'visa cash app', 'rb'],
    fileName: 'racing bulls.png',
  },
  { aliases: ['red bull', 'oracle'], fileName: 'red bull racing.png' },
  { aliases: ['williams'], fileName: 'williams.png' },
  { aliases: ['audi', 'sauber', 'kick'], fileName: 'audi.png' },
  { aliases: ['cadillac'], fileName: 'cadillac.png' },
  { aliases: ['alpine'], fileName: 'alpine.png' },
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

const getTeamImageFileName = (teamName: string) => {
  const normalizedTeamName = normalizeTeamName(teamName);

  return (
    teamImageMatchers.find(({ aliases }) =>
      aliases.some((alias) => normalizedTeamName.includes(alias))
    )?.fileName ?? 'unknown team.png'
  );
};

const getTeamImageSrc = (teamName: string) =>
  getPublicImageSrc(getTeamImageFileName(teamName));

const StyledTeamCard = styled.div<{ $url: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  min-width: 10rem;
  width: 35rem;
  height: 120px;
  overflow: hidden;

  color: var(--color-grey-200);
  border-radius: var(--border-radius-3xl);

  padding-left: 2rem;

  column-gap: 1rem;

  &::before {
    position: absolute;
    inset: 0;
    content: '';
    background-image: url('${(props) => props.$url}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.7;
  }

  & > * {
    position: relative;
  }
`;

function TeamStandingCard({ team }: { team: teamStandingsType }) {
  const imageSrc = getTeamImageSrc(team.team_name);

  return (
    <StyledTeamCard $url={imageSrc}>
      <StyledDriverRow>
        <h3>{team.team_name}</h3>
      </StyledDriverRow>
    </StyledTeamCard>
  );
}

export default TeamStandingCard;
