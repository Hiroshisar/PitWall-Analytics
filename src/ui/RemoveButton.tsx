import { RiCloseLine } from 'react-icons/ri';
import type { ButtonHTMLAttributes } from 'react';

function RemoveButton({
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} aria-label="Rimuovi pilota" {...props}>
      <RiCloseLine aria-hidden="true" />
    </button>
  );
}

export default RemoveButton;
