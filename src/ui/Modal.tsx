import { ModalHeader, ModalTitle, Overlay, StyledModal } from '../style/styles';
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
      <StyledModal>
        <ModalHeader>
          <ModalTitle>Selezione piloti</ModalTitle>
          <CloseButton onClick={() => onClose()} />
        </ModalHeader>
        <DriversList
          drivers={drivers}
          selectedDrivers={selectedDrivers}
          onSelect={onSelect}
        />
      </StyledModal>
    </Overlay>
  );
}

export default Modal;
