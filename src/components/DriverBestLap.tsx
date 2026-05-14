import type { DriverBestLapProps, LapType } from '../utils/types.ts';
import { useMemo } from 'react';
import { formatLapTime } from '../utils/helpers.ts';
import { StyledBestLap } from '../style/styles.ts';

function DriverBestLap({ laps }: DriverBestLapProps) {
  const validLaps = useMemo<LapType[]>(() => {
    return laps.filter(
      (lap) => Number.isFinite(lap.lap_duration) && lap.lap_duration > 0
    );
  }, [laps]);

  const bestLap = useMemo<LapType | undefined>(() => {
    return validLaps.slice().sort((a, b) => a.lap_duration - b.lap_duration)[0];
  }, [validLaps]);

  return (
    <StyledBestLap>
      {bestLap ? formatLapTime(bestLap.lap_duration) : '--:--.---'}
    </StyledBestLap>
  );
}

export default DriverBestLap;
