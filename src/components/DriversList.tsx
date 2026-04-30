import { useMemo, useState } from 'react';
import {
  DriverListItem,
  DriversListContainer,
  DriversConfirmButton,
  StyledDriversGrid,
  StyledDriversGridColumn,
  StyledDriversGridRows,
  StyledDriversList,
  StyledDriversRowContainer,
  StyledTeamName,
  StyledTeamNameContainer,
  AddDriverButton,
} from '../style/styles';
import type { DriversListVariant } from '../style/styles';
import type { driverType } from '../utils/types';
import Driver from './Driver';
import { FaPlus } from 'react-icons/fa';

type DriversListProps = {
  drivers: driverType[];
  type?: DriversListVariant;
  onSelect: (drivers: driverType[]) => void;
};

function DriversList({ drivers, onSelect, type = 'main' }: DriversListProps) {
  const [tempDrivers, setTempDrivers] = useState<driverType[]>([]);
  const canSelectDrivers = Boolean(onSelect);

  const handleConfirmSelection = () => {
    if (onSelect) onSelect(tempDrivers);
    setTempDrivers([]);
  };

  const isItemSelected = (driverNumber: number) =>
    !!tempDrivers.find((d) => d.driver_number === driverNumber);

  const handleClick = (driverNumber: number) => {
    if (!canSelectDrivers) return;

    setTempDrivers((currentDrivers) => {
      const alreadySelected = currentDrivers.some(
        (d) => d.driver_number === driverNumber
      );

      if (alreadySelected) {
        return currentDrivers.filter((d) => d.driver_number !== driverNumber);
      }

      const selectedDriver = drivers.find(
        (d) => d.driver_number === driverNumber
      );

      return selectedDriver
        ? [...currentDrivers, selectedDriver]
        : currentDrivers;
    });
  };

  const handleRemoveDriver = (driverNumber: number) => {
    const filteredList = drivers.filter(
      (driver) => driver.driver_number !== driverNumber
    );
    if (onSelect) onSelect(filteredList);
  };

  const sortedDrivers = useMemo(() => {
    const groupedDrivers: Record<string, driverType[]> = {};

    [...drivers]
      .sort((a, b) => a.team_name.localeCompare(b.team_name))
      .forEach((d) => {
        if (groupedDrivers[d.team_name]) {
          groupedDrivers[d.team_name].push(d);
        } else {
          groupedDrivers[d.team_name] = [d];
        }
      });

    return groupedDrivers;
  }, [drivers]);

  return (
    <DriversListContainer>
      <StyledDriversList $variant={type}>
        <StyledDriversGrid $variant={type}>
          <StyledDriversGridColumn $variant={type}>
            {Object.entries(sortedDrivers).map(([team, teamDrivers]) => (
              <StyledDriversGridRows key={team} $variant={type}>
                {type === 'main' && (
                  <StyledTeamNameContainer>
                    <StyledTeamName>{team}</StyledTeamName>
                  </StyledTeamNameContainer>
                )}
                <StyledDriversRowContainer $variant={type}>
                  {teamDrivers.map((driver) => (
                    <DriverListItem
                      key={`${driver.broadcast_name}-${driver.driver_number}`}
                      $isInteractive={canSelectDrivers}
                      onClick={
                        canSelectDrivers
                          ? () => handleClick(driver.driver_number)
                          : undefined
                      }
                    >
                      <Driver
                        driver={driver}
                        isItemSelected={isItemSelected}
                        type={type}
                        onRemove={handleRemoveDriver}
                      />
                    </DriverListItem>
                  ))}
                </StyledDriversRowContainer>
              </StyledDriversGridRows>
            ))}
            {type === 'secondary' && (
              <DriverListItem
                $isInteractive={true}
                onClick={() => {
                  console.log('click');
                }}
              >
                <AddDriverButton>
                  <FaPlus />
                </AddDriverButton>
              </DriverListItem>
            )}
          </StyledDriversGridColumn>
        </StyledDriversGrid>
        {type === 'main' ? (
          <div>
            <DriversConfirmButton
              disabled={tempDrivers.length === 0}
              onClick={handleConfirmSelection}
            >
              PROCEDI
            </DriversConfirmButton>
          </div>
        ) : null}
      </StyledDriversList>
    </DriversListContainer>
  );
}

export default DriversList;
