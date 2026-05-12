import { useMemo } from 'react';
import { formatLapTime } from '../utils/helpers.ts';
import type { DriverLastLapProps, lapType } from '../utils/types.ts';
import { StyledLastLap } from '../style/styles.ts';

function DriverLastLap({ laps }: DriverLastLapProps) {
  const validLaps = useMemo<lapType[]>(() => {
    return laps.filter(
      (lap) => Number.isFinite(lap.lap_duration) && lap.lap_duration > 0
    );
  }, [laps]);

  const lastLap = useMemo<lapType | undefined>(() => {
    return validLaps.slice().sort((a, b) => b.lap_number - a.lap_number)[0];
  }, [validLaps]);

  return (
    <StyledLastLap>
      {lastLap ? formatLapTime(lastLap.lap_duration) : '--:--.---'}
    </StyledLastLap>
  );
}

export default DriverLastLap;
