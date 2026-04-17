import Form from "../components/Form";
import { Overlay, StyledModal } from "../style/styles";

function Modal() {
  return (
    <Overlay>
      <StyledModal>
        <Form />
      </StyledModal>
    </Overlay>
  );
}

export default Modal;
