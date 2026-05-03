import type { stintType } from '../utils/types.ts';
import { TyresCircle } from '../style/styles.ts';

function Tyres({ stints }: { stints: stintType[] }) {
  if (!stints || stints.length === 0) return;

  const lastStint = stints[stints.length - 1];

  let color = undefined;

  switch (lastStint.compound) {
    case 'SOFT':
      color = 'd91616';
      break;
    case 'MEDIUM':
      color = 'f6d009';
      break;
    case 'HARD':
      color = 'fff';
      break;
    case 'INTERMEDIATE':
      color = '18a84d';
      break;
    case 'WET':
      color = '314ed2';
      break;
    default:
      color = undefined;
      break;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '2px',
      }}
    >
      <h5>{lastStint.tyre_age_at_start}</h5>
      <TyresCircle $color={color ?? 'transparent'} />
    </div>
  );
}

export default Tyres;
