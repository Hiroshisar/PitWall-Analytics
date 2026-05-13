import { ModalHeader, ModalTitle, Overlay, StyledModal } from '../style/styles';
import DriversList from '../components/DriversList.tsx';
import type { ModalProps } from '../utils/types.ts';
import Button from './Button.tsx';

function Modal({ drivers, selectedDrivers, onSelect, onClose }: ModalProps) {
  return (
    <Overlay>
      <StyledModal>
        <ModalHeader>
          <ModalTitle>Select drivers</ModalTitle>
          <Button type="close" onClick={() => onClose()} />
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
