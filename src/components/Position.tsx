import DriverTag from './DriverTag';
import DriverLastLap from './DriverLastLap';
import type { PositionProps } from '../utils/types';
import DriverBestLap from './DriverBestLap.tsx';
import Interval from './Interval.tsx';
import Pit from './Pit.tsx';
import Tyres from './Tyres.tsx';
import {
  LapSummaryRow,
  StyledBestAndLastLap,
  StyledNotRacePosition,
  StyledRacePosition,
} from '../style/styles.ts';

function Position({
  isRace,
  driver,
  laps,
  pits,
  stints,
  intervals,
}: PositionProps) {
  return (
    <>
      {isRace ? (
        <StyledRacePosition>
          <DriverTag
            driverTag={driver.name_acronym}
            position={driver.position ?? 0}
            color={driver.team_colour}
          />

          <Interval intervals={intervals} />

          <DriverLastLap laps={laps} />

          <DriverBestLap laps={laps} />

          <Pit pits={pits} />

          <Tyres stints={stints} />
        </StyledRacePosition>
      ) : (
        <StyledNotRacePosition>
          <DriverTag
            driverTag={driver.name_acronym}
            position={driver.position ?? 0}
            color={driver.team_colour}
          />
          <StyledBestAndLastLap>
            <LapSummaryRow>
              <h5>Last:</h5>
              <DriverLastLap laps={laps} />
            </LapSummaryRow>
            <LapSummaryRow>
              <h5>Best:</h5>
              <DriverBestLap laps={laps} />
            </LapSummaryRow>
          </StyledBestAndLastLap>
        </StyledNotRacePosition>
      )}
    </>
  );
}

export default Position;
