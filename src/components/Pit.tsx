import type { pitType } from '../utils/types.ts';

function Pit({ pits }: { pits: pitType[] }) {
  // TODO in hover appare una tooltip con i dati di tutti i pitstop organizzati in tabella
  return (
    <div>
      <h4>{pits.length}</h4>
    </div>
  );
}

export default Pit;
