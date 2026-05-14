import { useEffect, useMemo, useState } from 'react';
import {
  ListItem,
  ListContainer,
  StyledListGrid,
  StyledListGridColumn,
  StyledListGridRows,
  StyledList,
  StyledListRowContainer,
  StyledTeamName,
  StyledTeamNameContainer,
  StyledButton,
} from '../style/styles';
import type { DriverType, DriversListProps } from '../utils/types';
import Driver from './Driver';
import { FaPlus } from 'react-icons/fa';
import Button from '../ui/Button.tsx';

const noSelectedDrivers: DriverType[] = [];

function DriversList({
  drivers,
  selectedDrivers = noSelectedDrivers,
  onSelect,
  type = 'main',
  onOpen,
}: DriversListProps) {
  const [tempDrivers, setTempDrivers] = useState<DriverType[]>(selectedDrivers);
  const canSelectDrivers = Boolean(onSelect);

  useEffect(() => {
    setTempDrivers(selectedDrivers);
  }, [selectedDrivers]);

  const handleConfirmSelection = () => {
    if (onSelect) onSelect(tempDrivers);
  };

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

  const isItemSelected = (driverNumber: number) =>
    !!tempDrivers.find((d) => d.driver_number === driverNumber);

  const handleRemoveDriver = (driverNumber: number) => {
    const filteredList = drivers.filter(
      (driver) => driver.driver_number !== driverNumber
    );
    if (onSelect) {
      setTempDrivers(filteredList);
      onSelect(filteredList);
    }
  };

  const handleColorChange = (driverNumber: number, color: string) => {
    const updatedDrivers = drivers.map((driver) =>
      driver.driver_number === driverNumber
        ? { ...driver, team_colour: color }
        : driver
    );

    setTempDrivers((currentDrivers) =>
      currentDrivers.map((driver) =>
        driver.driver_number === driverNumber
          ? { ...driver, team_colour: color }
          : driver
      )
    );
    onSelect(updatedDrivers);
  };

  const sortedDrivers = useMemo(() => {
    const groupedDrivers: Record<string, DriverType[]> = {};

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
    <ListContainer>
      <StyledList $variant={type}>
        <StyledListGrid $variant={type}>
          <StyledListGridColumn $variant={type}>
            {Object.entries(sortedDrivers).map(([team, teamDrivers]) => (
              <StyledListGridRows key={team} $variant={type}>
                {type === 'main' && (
                  <StyledTeamNameContainer>
                    <StyledTeamName>{team}</StyledTeamName>
                  </StyledTeamNameContainer>
                )}
                <StyledListRowContainer $variant={type}>
                  {teamDrivers.map((driver) => (
                    <ListItem
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
                        isItemSelected={isItemSelected(driver.driver_number)}
                        type={type}
                        onRemove={handleRemoveDriver}
                        onColorChange={handleColorChange}
                      />
                    </ListItem>
                  ))}
                </StyledListRowContainer>
              </StyledListGridRows>
            ))}
            {type === 'secondary' && (
              <ListItem $isInteractive={true}>
                <StyledButton
                  onClick={() => {
                    if (onOpen) onOpen(true);
                  }}
                >
                  <FaPlus />
                </StyledButton>
              </ListItem>
            )}
          </StyledListGridColumn>
        </StyledListGrid>
        {type === 'main' ? (
          <Button
            type="confirm"
            disabled={tempDrivers.length < 1}
            onClick={handleConfirmSelection}
          >
            PROCEDI
          </Button>
        ) : null}
      </StyledList>
    </ListContainer>
  );
}

export default DriversList;
