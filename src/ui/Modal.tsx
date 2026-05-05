import { Overlay, StyledModal } from '../style/styles';
import DriversList from '../components/DriversList.tsx';
import type { driverType } from '../utils/types.ts';
import CloseButton from './CloseButton.tsx';

function Modal({
  drivers,
  selectedDrivers,
  onSelect,
  onClose,
}: {
  drivers: driverType[];
  selectedDrivers: driverType[];
  onSelect: (driver: driverType[]) => void;
  onClose: () => void;
}) {
  return (
    <Overlay>
      <>
        <StyledModal>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <h2 style={{ marginLeft: '5rem' }}>Selezione piloti</h2>
            <CloseButton onClick={() => onClose()} />
          </div>
          <DriversList
            drivers={drivers}
            selectedDrivers={selectedDrivers}
            onSelect={onSelect}
          />
        </StyledModal>
      </>
    </Overlay>
  );
}

export default Modal;
