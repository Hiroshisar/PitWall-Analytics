import {
  ColoredCircle,
  DriverNumber,
  DriverPortrait,
  StyledDriverMain,
  StyledDriverRow,
  StyledDriverSecondary,
} from '../style/styles';
import type { DriversListVariant } from '../style/styles';
import type { driverType } from '../utils/types';
import RemoveButton from '../ui/RemoveButton';

function Driver({
  driver,
  isItemSelected,
  type = 'main',
  onRemove,
}: {
  type?: DriversListVariant;
  driver: driverType;
  isItemSelected: (number: number) => boolean;
  onRemove?: (driverNumber: number) => void;
}) {
  if (type === 'secondary') {
    return (
      <StyledDriverSecondary>
        <ColoredCircle $color={driver.team_colour} />
        <h3>{`${driver.name_acronym} ${driver.driver_number}`}</h3>
        <RemoveButton
          className="remove-button"
          onClick={() => {
            onRemove?.(driver.driver_number);
          }}
        />
      </StyledDriverSecondary>
    );
  }

  return (
    <StyledDriverMain $selected={isItemSelected(driver.driver_number)}>
      <DriverPortrait>
        <img
          src={`./${driver.driver_number}.png`}
          alt={`${driver.broadcast_name}-${driver.driver_number}`}
          width={150}
        />
      </DriverPortrait>
      <StyledDriverRow>
        <h3>{driver.last_name.toLocaleUpperCase()}</h3>
      </StyledDriverRow>
      <DriverNumber>
        <h2>{driver.driver_number}</h2>
      </DriverNumber>
    </StyledDriverMain>
  );
}

export default Driver;
