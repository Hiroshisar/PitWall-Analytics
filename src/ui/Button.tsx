import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { StyledNavLink } from '../style/styles.ts';

export function Button({ to, children }: { to: string; children: ReactNode }) {
  const { pathname } = useLocation();

  const isSelected = pathname === to;

  return (
    <StyledNavLink to={to} $isSelected={isSelected}>
      {children}
    </StyledNavLink>
  );
}
