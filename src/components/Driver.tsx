import {
  ColoredCircle,
  DriverNumber,
  DriverPortrait,
  StyledDriverMain,
  StyledDriverRow,
  StyledDriverSecondary,
} from '../style/styles';
import type { driverType } from '../utils/types';

function Driver({
  driver,
  isItemSelected,
  type = 'main',
}: {
  type: string;
  driver: driverType;
  isItemSelected: (number: number) => boolean;
}) {
  return (
    <>
      {type === 'main' && (
        <StyledDriverMain selected={isItemSelected(driver.driver_number)}>
          <DriverPortrait>
            <img
              src={`./${driver.driver_number}.png`}
              alt={`${driver.broadcast_name}-${driver.driver_number}`}
              width={150}
            />
          </DriverPortrait>
          <StyledDriverRow>
            <h3>{driver.last_name.toLocaleUpperCase()}</h3>
            <h3>{driver.team_name}</h3>
          </StyledDriverRow>
          <DriverNumber>
            <h2>{driver.driver_number}</h2>
          </DriverNumber>
        </StyledDriverMain>
      )}
      {type === 'secondary' && (
        <StyledDriverSecondary>
          <ColoredCircle color={driver.team_colour} />
          <div>
            <h3>{`${driver.name_acronym} ${driver.driver_number}`}</h3>
          </div>
        </StyledDriverSecondary>
      )}
    </>
  );
}

export default Driver;
