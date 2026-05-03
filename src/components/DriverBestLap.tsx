import type { lapType } from '../utils/types.ts';
import { useMemo } from 'react';
import { formatLapTime } from '../utils/helpers.ts';
import styled from 'styled-components';

const StyledBestLap = styled.h5`
  color: var(--color-indigo-700);
`;

function DriverBestLap({ laps }: { laps: lapType[] }) {
  const validLaps = useMemo<lapType[]>(() => {
    return laps.filter(
      (lap) => Number.isFinite(lap.lap_duration) && lap.lap_duration > 0
    );
  }, [laps]);

  const bestLap = useMemo<lapType | undefined>(() => {
    return validLaps.slice().sort((a, b) => a.lap_duration - b.lap_duration)[0];
  }, [validLaps]);

  return (
    <StyledBestLap>
      {bestLap ? formatLapTime(bestLap.lap_duration) : '--:--.---'}
    </StyledBestLap>
  );
}

export default DriverBestLap;
