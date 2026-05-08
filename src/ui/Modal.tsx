import { ModalHeader, ModalTitle, Overlay, StyledModal } from '../style/styles';
import DriversList from '../components/DriversList.tsx';
import type { ModalProps } from '../utils/types.ts';
import CloseButton from './CloseButton.tsx';

function Modal({
  drivers,
  selectedDrivers,
  onSelect,
  onClose,
}: ModalProps) {
  return (
    <Overlay>
      <StyledModal>
        <ModalHeader>
          <ModalTitle>Select drivers</ModalTitle>
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
