import styled from 'styled-components';
import { useFetchPosition } from '../hooks/useFetchPosition.ts';
import Position from './Position.tsx';
import type { driverType } from '../utils/types.ts';
import { useMemo } from 'react';
import { useFetchDrivers } from '../hooks/useFetchDriver.ts';

const StyledSessionGridContainer = styled.div`
  padding: 1rem;
  margin: 0.5rem;

  display: grid;

  grid-template-rows: 1fr auto;

  gap: 0.5rem;

  width: 100%;
  max-height: max(0px, calc(100dvh - 64rem));

  overflow-y: auto;
`;

type driverPositionType = driverType & { position: number };

function SessionGrid({ sessionKey }: { sessionKey: number }) {
  const { data: sessionGrid } = useFetchPosition(sessionKey);
  const { data: drivers } = useFetchDrivers(sessionKey);

  const updatedDriversList = useMemo<driverPositionType[]>(() => {
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

  return (
    <StyledSessionGridContainer>
      {updatedDriversList.map((driver) => (
        <Position
          key={driver.driver_number}
          sessionKey={sessionKey}
          driver={driver}
        />
      ))}
    </StyledSessionGridContainer>
  );
}

export default SessionGrid;

/*

  const [cars, setCars] = useState<{ driver: number; position: number }[]>([]);
  useEffect(() => {
    sessionGrid?.map((driver) => {
      const findedDriver = cars?.find(
        (car) => car.driver === driver.driver_number
      );
      if (!findedDriver) {
        setCars([
          ...cars,
          { driver: driver.driver_number, position: driver.position },
        ]);
      } else {
        if (!driver.position || driver.position <= 0) return;

        const filteredCars = cars.filter(
          (c) => c.driver != findedDriver.driver
        );
        setCars([
          ...filteredCars,
          { ...findedDriver, position: driver.position },
        ]);
      }
    });
  }, [sessionGrid]);


*/
