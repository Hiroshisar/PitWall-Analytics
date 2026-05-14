import type { TeamStandingCardProps } from '../utils/types.ts';
import { StyledCardRow, StyledTeamCard } from '../style/styles.ts';
import { getTeamImageSrc } from '../utils/helpers.ts';

function TeamStandingCard({ teamStandings, team }: TeamStandingCardProps) {
  const imageSrc = getTeamImageSrc(
    teamStandings ? teamStandings.team_name : (team?.team_name ?? ''),
    'background'
  );

  return (
    <>
      {teamStandings && (
        <StyledTeamCard $url={imageSrc}>
          <StyledCardRow>
            <img
              src={getTeamImageSrc(teamStandings.team_name, 'logo')}
              alt={teamStandings.team_name}
            />
            <h3>{teamStandings.team_name}</h3>
          </StyledCardRow>
        </StyledTeamCard>
      )}
      {team && (
        <StyledTeamCard $url={imageSrc}>
          <StyledCardRow>
            <img
              src={getTeamImageSrc(team.team_name, 'logo')}
              alt={team.team_name}
            />
            <h3>{team.team_name}</h3>
          </StyledCardRow>
        </StyledTeamCard>
      )}
    </>
  );
}

export default TeamStandingCard;
