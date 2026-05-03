import styled from 'styled-components';
import { useFetchPosition } from '../hooks/useFetchPosition.ts';
import Position from './Position.tsx';
import type {
  driverType,
  intervalType,
  lapType,
  pitType,
  sessionType,
  stintType,
} from '../utils/types.ts';
import { useMemo } from 'react';
import { useFetchDrivers } from '../hooks/useFetchDriver.ts';
import { useFetchLaps } from '../hooks/useFetchLaps.ts';
import { useFetchPit } from '../hooks/useFetchPit.ts';
import { useFetchStints } from '../hooks/useFetchStints.ts';
import { useFetchIntervals } from '../hooks/useFetchIntervals.ts';
import { StyledRacePositionTags } from '../style/styles.ts';

const StyledSessionGridContainer = styled.div`
  display: grid;
  grid-auto-rows: max-content;
  align-content: start;

  gap: 3px;

  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;

  overflow-y: auto;
`;

function SessionGrid({ session }: { session: sessionType }) {
  const { data: sessionGrid } = useFetchPosition(session.session_key);
  const { data: drivers } = useFetchDrivers(session.session_key);

  const updatedDriversList = useMemo<driverType[]>(() => {
    const positionByDriverNumber = new Map(
      (sessionGrid ?? []).map((position) => [
        position.driver_number,
        position.position,
      ])
    );

    return (drivers ?? [])
      .flatMap((driver) => {
        const position = positionByDriverNumber.get(driver.driver_number);

        if (!position || position <= 0) return [];

        return [{ ...driver, position }];
      })
      .sort((a, b) => a.position - b.position);
  }, [drivers, sessionGrid]);
  /*
  const driverNumbers = useMemo(
    () => updatedDriversList.map((driver) => driver.driver_number),
    [updatedDriversList]
  );
*/
  const { data: laps = [] } = useFetchLaps(session.session_key);

  const { data: pits = [] } = useFetchPit(session.session_key);

  const { data: stints = [] } = useFetchStints(session.session_key);

  const { data: intervals = [] } = useFetchIntervals(session.session_key);

  const lapsByDriverNumber = useMemo(() => {
    return laps.reduce<Map<number, lapType[]>>((groupedLaps, lap) => {
      const driverLaps = groupedLaps.get(lap.driver_number) ?? [];
      driverLaps.push(lap);
      groupedLaps.set(lap.driver_number, driverLaps);

      return groupedLaps;
    }, new Map());
  }, [laps]);

  const pitsByDriverNumber = useMemo(() => {
    return pits.reduce<Map<number, pitType[]>>((groupedPits, pit) => {
      const driverPits = groupedPits.get(pit.driver_number) ?? [];
      driverPits.push(pit);
      groupedPits.set(pit.driver_number, driverPits);

      return groupedPits;
    }, new Map());
  }, [pits]);

  const stintsByDriverNumber = useMemo(() => {
    return stints.reduce<Map<number, stintType[]>>((groupedStints, stint) => {
      const driverPits = groupedStints.get(stint.driver_number) ?? [];
      driverPits.push(stint);
      groupedStints.set(stint.driver_number, driverPits);

      return groupedStints;
    }, new Map());
  }, [stints]);

  const intervalsByDriverNumber = useMemo(() => {
    return intervals.reduce<Map<number, intervalType[]>>(
      (groupedIntervals, interval) => {
        const driverIntervals =
          groupedIntervals.get(interval.driver_number) ?? [];
        driverIntervals.push(interval);
        groupedIntervals.set(interval.driver_number, driverIntervals);

        return groupedIntervals;
      },
      new Map()
    );
  }, [intervals]);

  const isRace =
    session.session_type === 'Race' || session.session_type === 'Sprint';

  return (
    <StyledSessionGridContainer>
      <StyledRacePositionTags>
        <h5 style={{ paddingLeft: '1rem' }}>Driver</h5>
        <h5>Inter</h5>
        <h5>Last</h5>
        <h5>Best</h5>
        <h5>Pits</h5>
        <h5>Tyre</h5>
      </StyledRacePositionTags>
      {updatedDriversList.map((driver) => (
        <Position
          key={driver.driver_number}
          driver={driver}
          laps={lapsByDriverNumber.get(driver.driver_number) ?? []}
          isRace={isRace}
          pits={pitsByDriverNumber.get(driver.driver_number) ?? []}
          stints={stintsByDriverNumber.get(driver.driver_number) ?? []}
          intervals={intervalsByDriverNumber.get(driver.driver_number) ?? []}
        />
      ))}
    </StyledSessionGridContainer>
  );
}

export default SessionGrid;
