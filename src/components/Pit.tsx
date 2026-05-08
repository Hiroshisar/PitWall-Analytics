import type { PitProps } from '../utils/types.ts';

function Pit({ pits }: PitProps) {
  return (
    <div>
      <h4>{pits.length}</h4>
    </div>
  );
}

export default Pit;
