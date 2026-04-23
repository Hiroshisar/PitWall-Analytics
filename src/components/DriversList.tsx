import { useState } from 'react';
import { DriversListContainer, StyledDriversList } from '../style/styles';
import type { driverType } from '../utils/types';
import Driver from './Driver';

function DriversList({
  drivers,
  onSelect,
  type = 'main',
}: {
  drivers: driverType[];
  type: string;
  onSelect?: (drivers: driverType[]) => void;
}) {
  const [tempDrivers, setTempDrivers] = useState<driverType[]>([]);

  const handleConfirmSelection = () => {
    if (onSelect) onSelect(tempDrivers);
    setTempDrivers([]);
  };

  const isItemSelected = (driverNumber: number) =>
    !!tempDrivers.find((d) => d.driver_number === driverNumber);

  const handleClick = (driverNumber: number) => {
    if (isItemSelected(driverNumber))
      setTempDrivers(
        tempDrivers.filter((d) => d.driver_number !== driverNumber)
      );
    else {
      const selected = drivers.filter((d) => d.driver_number === driverNumber);
      setTempDrivers([...tempDrivers, ...selected]);
    }
  };
  return (
    <DriversListContainer>
      <StyledDriversList>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          {drivers.map((driver) => (
            <div
              key={`${driver.broadcast_name}-${driver.driver_number}`}
              onClick={() => handleClick(driver.driver_number)}
            >
              <Driver
                driver={driver}
                isItemSelected={isItemSelected}
                type={type}
              />
            </div>
          ))}
        </div>
        {onSelect ? (
          <div>
            <button
              style={{ color: 'black', width: '300px', height: '5rem' }}
              disabled={tempDrivers?.length === 0 ? true : false}
              onClick={handleConfirmSelection}
            >
              PROCEDI
            </button>
          </div>
        ) : null}
      </StyledDriversList>
    </DriversListContainer>
  );
}

export default DriversList;
