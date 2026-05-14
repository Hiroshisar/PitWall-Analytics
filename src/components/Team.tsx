import {
  ColoredCircle,
  StyledListMain,
  StyledListSecondary,
} from '../style/styles';
import type { TeamProps } from '../utils/types';
import Button from '../ui/Button';
import { normalizeHexColor } from '../utils/helpers.ts';
import TeamStandingCard from '../ui/TeamStandingCard.tsx';

function Team({ team, isItemSelected, type = 'main', onRemove }: TeamProps) {
  if (type === 'secondary') {
    return (
      <StyledListSecondary>
        <ColoredCircle
          as="label"
          $color={normalizeHexColor(team.team_colour) ?? ''}
        />
        <h3>{team.team_name}</h3>
        <Button
          type={'remove'}
          onClick={() => {
            onRemove?.(team.team_name);
          }}
        />
      </StyledListSecondary>
    );
  }

  return (
    <StyledListMain $selected={isItemSelected}>
      <TeamStandingCard team={team} />
    </StyledListMain>
  );
}

export default Team;
