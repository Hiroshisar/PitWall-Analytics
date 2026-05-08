import { StyledFlagBadge } from '../style/styles.ts';
import type { FlagProps } from '../utils/types.ts';

function Flag({ race_control }: FlagProps) {
  const flagColor = getFlagColor(race_control.flag);

  if (!race_control.flag) return null;

  return (
    <StyledFlagBadge $flagColor={flagColor}>{race_control.flag}</StyledFlagBadge>
  );
}

export default Flag;

function getFlagColor(flag?: string) {
  switch (flag) {
    case 'GREEN':
      return '--color-flag-green';
    case 'YELLOW':
    case 'DOUBLE YELLOW':
      return '--color-flag-yellow';
    case 'RED':
      return '--color-flag-red';
    default:
      return '';
  }
}
