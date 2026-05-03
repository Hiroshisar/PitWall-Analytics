import { useMemo } from 'react';
import { formatLapTime } from '../utils/helpers.ts';
import type { lapType } from '../utils/types.ts';
import styled from 'styled-components';

const StyledLastLap = styled.h5`
  color: var(--color-grey-200);
`;

function DriverLastLap({ laps }: { laps: lapType[] }) {
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
