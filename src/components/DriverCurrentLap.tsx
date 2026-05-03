import type { lapType } from '../utils/types.ts';
import { useMemo } from 'react';

function DriverCurrentLap({ laps }: { laps: lapType[] }) {
  const validLaps = useMemo<lapType[]>(() => {
    return laps.filter(
      (lap) => Number.isFinite(lap.lap_duration) && lap.lap_duration > 0
    );
  }, [laps]);
  // NON TOCCARE
  const lastLap = useMemo<lapType | undefined>(() => {
    return validLaps.slice().sort((a, b) => b.lap_number - a.lap_number)[0];
  }, [validLaps]);
  // NON TOCCARE
  const bestLap = useMemo<lapType | undefined>(() => {
    return validLaps.slice().sort((a, b) => a.lap_duration - b.lap_duration)[0];
  }, [validLaps]);

  void lastLap;
  void bestLap;

  return <>{}</>;
}

export default DriverCurrentLap;
