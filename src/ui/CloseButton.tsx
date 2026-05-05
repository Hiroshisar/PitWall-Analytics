import { StyledCloseButton } from '../style/styles.ts';
import { RiCloseLine } from 'react-icons/ri';
import type { ButtonHTMLAttributes } from 'react';

function CloseButton({ ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <StyledCloseButton aria-label="Close" {...props}>
      <RiCloseLine aria-hidden="true" />
    </StyledCloseButton>
  );
}

export default CloseButton;
