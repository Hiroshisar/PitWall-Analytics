import styled from 'styled-components';
import DriverTag from './DriverTag';
import DriverCurrentLap from './DriverCurrentLap';
import DriverLastLap from './DriverLastLap';
import type {
  driverType,
  intervalType,
  lapType,
  pitType,
  stintType,
} from '../utils/types';
import DriverBestLap from './DriverBestLap.tsx';
import Interval from './Interval.tsx';
import Pit from './Pit.tsx';
import Tyres from './Tyres.tsx';
import { StyledRacePosition } from '../style/styles.ts';

const StyledNotRacePosition = styled.div`
  height: 40px;
  width: 100%;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: auto 1fr 2fr;

  justify-content: center;
  align-items: center;

  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-lg);

  padding: 2px;
`;

const StyledBestAndLastLap = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr;
  align-items: center;

  padding-left: 2px;
`;

function Position({
  isRace,
  driver,
  laps,
  pits,
  stints,
  intervals,
}: {
  isRace: boolean;
  driver: driverType;
  laps: lapType[];
  pits: pitType[];
  stints: stintType[];
  intervals: intervalType[];
}) {
  // TODO rimuovere questo check
  //isRace = true;
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <h5>Last:</h5>
              <DriverLastLap laps={laps} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <h5>Best:</h5>
              <DriverBestLap laps={laps} />
            </div>
          </StyledBestAndLastLap>
          <DriverCurrentLap laps={laps} />
        </StyledNotRacePosition>
      )}
    </>
  );
}

export default Position;
