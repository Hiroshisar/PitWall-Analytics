import { useFetchPosition } from '../hooks/useFetchPosition.ts';
import Position from './Position.tsx';
import type {
  driverType,
  intervalType,
  lapType,
  OpenF1Key,
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
import {
  RacePositionDriverHeader,
  SessionGridContainer,
  StyledRacePositionTags,
} from '../style/styles.ts';

function SessionGrid({
  session,
  sessionKey = session.session_key,
}: {
  session: sessionType;
  sessionKey?: OpenF1Key;
}) {
  const { data: sessionGrid } = useFetchPosition(sessionKey);
  const { data: drivers } = useFetchDrivers(sessionKey);

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
  const { data: laps = [] } = useFetchLaps(sessionKey);

  const { data: pits = [] } = useFetchPit(sessionKey);

  const { data: stints = [] } = useFetchStints(sessionKey);

  const { data: intervals = [] } = useFetchIntervals(sessionKey);

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
    <SessionGridContainer>
      <StyledRacePositionTags>
        <RacePositionDriverHeader>Driver</RacePositionDriverHeader>
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
    </SessionGridContainer>
  );
}

export default SessionGrid;
