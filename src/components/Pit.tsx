import type { pitType } from '../utils/types.ts';

function Pit({ pits }: { pits: pitType[] }) {
  return (
    <div>
      <h4>{pits.length}</h4>
    </div>
  );
}

export default Pit;
