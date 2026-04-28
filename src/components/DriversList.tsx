import { useState } from 'react';
import {
  DriversListContainer,
  StyledDriversGrid,
  StyledDriversList,
} from '../style/styles';
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
  drivers.sort((a, b) => a.team_name.localeCompare(b.team_name));
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

  // TODO implementare uno useMemo per ordinare i piloti in base al nome del team e poi mostrarli con "nome team:" -> piloti

  return (
    <DriversListContainer>
      <StyledDriversList>
        <StyledDriversGrid>
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
        </StyledDriversGrid>
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
