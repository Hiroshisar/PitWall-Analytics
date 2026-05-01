import { useFetchPosition } from '../hooks/useFetchPosition.ts';
import { useEffect, useState } from 'react';

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
    <>
      <h1>SESSION GRID</h1>
      {sessionGrid &&
        cars.map((row) => (
          <div>
            <h2>
              {row.driver} - {row.position}
            </h2>{' '}
          </div>
        ))}
    </>
  );
}

export default SessionGrid;
