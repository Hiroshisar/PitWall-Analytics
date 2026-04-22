import {
  DriverNumber,
  DriverPortrait,
  StyledDriver,
  StyledDriverRow,
  StyledDriversList,
  StyleDriverGrid,
} from "../style/styles";
import type { driverType } from "../utils/types";

function Driver({
  drivers,
  selectedDrivers,
  onSelect,
}: {
  drivers: driverType[];
  selectedDrivers: driverType[];
  onSelect: (drivers: driverType[]) => void;
}) {
  const isItemSelected = (driverNumber: number) =>
    !!selectedDrivers.find((d) => d.driver_number === driverNumber);

  const handleClick = (driverNumber: number) => {
    if (isItemSelected(driverNumber))
      onSelect(selectedDrivers.filter((d) => d.driver_number !== driverNumber));
    else {
      const selected = drivers.filter((d) => d.driver_number === driverNumber);
      onSelect([...selectedDrivers, ...selected]);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <StyledDriversList>
        {drivers.map((driver) => (
          <div
            key={`${driver.broadcast_name}-${driver.driver_number}`}
            onClick={() => handleClick(driver.driver_number)}
          >
            <StyledDriver selected={isItemSelected(driver.driver_number)}>
              <StyleDriverGrid>
                <DriverPortrait>
                  <img
                    src={`./${driver.driver_number}.png`}
                    alt={`${driver.broadcast_name}-${driver.driver_number}`}
                    width={150}
                  />
                </DriverPortrait>
                <StyledDriverRow>
                  <h2>{driver.broadcast_name.toLocaleUpperCase()}</h2>
                  <h3>{driver.team_name}</h3>
                </StyledDriverRow>
                <DriverNumber>
                  <h2>{driver.driver_number}</h2>
                </DriverNumber>
              </StyleDriverGrid>
            </StyledDriver>
          </div>
        ))}
      </StyledDriversList>
    </div>
  );
}

export default Driver;
