import { useLocation } from 'react-router-dom';
import { StyledNavLink } from '../style/styles.ts';
import type { ButtonProps } from '../utils/types.ts';

export function Button({ to, children }: ButtonProps) {
  const { pathname } = useLocation();

  const isSelected = pathname === to;

  return (
    <StyledNavLink to={to} $isSelected={isSelected}>
      {children}
    </StyledNavLink>
  );
}
