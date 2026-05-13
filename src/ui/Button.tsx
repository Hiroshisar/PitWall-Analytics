import { useLocation } from 'react-router-dom';
import {
  DriversConfirmButton,
  StyledButton,
  StyledCloseButton,
  StyledDriverRemoveButton,
  StyledNavLink,
} from '../style/styles.ts';
import type { ButtonProps } from '../utils/types.ts';
import { RiCloseLine } from 'react-icons/ri';

function Button({ to, type, children, ...rest }: ButtonProps) {
  const { pathname } = useLocation();

  if (type === 'link') {
    const isSelected = pathname === to;
    return (
      <StyledNavLink to={to ?? ''} $isSelected={isSelected}>
        {children}
      </StyledNavLink>
    );
  }

  if (type === 'close') {
    return (
      <StyledCloseButton type={'button'} aria-label="Close" {...rest}>
        <RiCloseLine aria-hidden="true" />
      </StyledCloseButton>
    );
  }

  if (type === 'remove') {
    return (
      <StyledDriverRemoveButton
        type={'button'}
        aria-label="Rimuovi pilota"
        {...rest}
      >
        <RiCloseLine aria-hidden="true" />
      </StyledDriverRemoveButton>
    );
  }

  if (type === 'confirm') {
    return <DriversConfirmButton {...rest}>{children}</DriversConfirmButton>;
  }

  if (type === 'button') {
    return <StyledButton {...rest}>{children}</StyledButton>;
  }

  return null;
}

export default Button;
