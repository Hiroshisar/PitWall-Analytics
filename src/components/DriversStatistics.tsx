import { useFetchDrivers } from '../hooks/useFetchDriver.ts';
import { useState } from 'react';
import type { DriverType } from '../utils/types.ts';
import Modal from '../ui/Modal.tsx';
import DriversList from './DriversList.tsx';
import Spinner from '../ui/Spinner.tsx';
import StatisticsItem from './StatisticsItem.tsx';
import { StyledTabContainer } from '../style/styles.ts';

function DriversStatistics({
  selectedDrivers,
  onSelect,
}: {
  selectedDrivers: DriverType[];
  onSelect: (driver: DriverType[]) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: drivers, isLoading: isLoadingDrivers } = useFetchDrivers();

  const handleDriversSelection = (drivers: DriverType[]) => {
    onSelect(drivers);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isModalOpen)
    return (
      <Modal
        drivers={drivers ?? []}
        selectedDrivers={selectedDrivers}
        onSelect={handleDriversSelection}
        onClose={handleCloseModal}
      />
    );

  if (isLoadingDrivers) return <Spinner />;

  return (
    <>
      <DriversList
        drivers={selectedDrivers}
        onSelect={handleDriversSelection}
        type="secondary"
        onOpen={setIsModalOpen}
      />
      {selectedDrivers.length > 0 && (
        <StyledTabContainer $numberOfElements={selectedDrivers.length}>
          {selectedDrivers.map((driver: DriverType) => (
            <StatisticsItem driver={driver} />
          ))}
        </StyledTabContainer>
      )}
    </>
  );
}

export default DriversStatistics;
