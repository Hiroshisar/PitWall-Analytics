import { TyresCircle, TyresSummary } from '../style/styles.ts';
import type { TyresProps } from '../utils/types.ts';

function Tyres({ stints }: TyresProps) {
  if (!stints || stints.length === 0) return null;

  const lastStint = stints[stints.length - 1];
  const color = getCompoundColor(lastStint.compound);

  return (
    <TyresSummary>
      <h5>{lastStint.tyre_age_at_start}</h5>
      <TyresCircle $color={color ?? 'transparent'} />
    </TyresSummary>
  );
}

export default Tyres;

function getCompoundColor(compound: string) {
  switch (compound) {
    case 'SOFT':
      return 'd91616';
    case 'MEDIUM':
      return 'f6d009';
    case 'HARD':
      return 'fff';
    case 'INTERMEDIATE':
      return '18a84d';
    case 'WET':
      return '314ed2';
    default:
      return undefined;
  }
}
