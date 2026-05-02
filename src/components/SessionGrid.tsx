import styled from 'styled-components';
import { useFetchPosition } from '../hooks/useFetchPosition.ts';
import { useEffect, useState } from 'react';

const StyledSessionGridContainer = styled.div`
  padding: 1rem;
  margin: 0.5rem;

  display: grid;

  grid-template-rows: 1fr, auto;

  width: 100%;
  max-height: max(0px, calc(100dvh - 64rem));

  overflow-y: auto;
`;

function SessionGrid({ sessionKey }: { sessionKey: number }) {
  const { data: sessionGrid } = useFetchPosition(sessionKey);
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
        const index = cars.findIndex((c) => findedDriver.driver === c.driver);
        cars[index].position = driver.position;
      }
    });
  }, [sessionGrid]);

  cars.sort((a, b) => a.position - b.position);

  return (
    <StyledSessionGridContainer>
      {sessionGrid &&
        cars.map((row) => (
          <div>
            <h2>
              {row.driver} - {row.position}
            </h2>{' '}
          </div>
        ))}
    </StyledSessionGridContainer>
  );
}

export default SessionGrid;
