import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Button({ to, children }: { to: string; children: ReactNode }) {
  const { pathname } = useLocation();

  const isSelected = pathname === to;

  return (
    <Link
      to={to}
      style={
        !isSelected
          ? {
              background: 'none',
              border: '1px solid var(--color-grey-600)',
              padding: '1rem 2rem',
              width: '200px',
              borderRadius: 'var(--border-radius-3xl)',
              transform: 'translateX(0.8rem)',
              transition: 'all 0.2s',
              marginTop: '1rem',
              textAlign: 'center',
            }
          : {
              background: 'none',
              border: '1px solid var(--color-grey-600)',
              padding: '1rem 2rem',
              width: '200px',
              borderRadius: 'var(--border-radius-3xl)',
              transform: 'translateX(0.8rem)',
              transition: 'all 0.2s',
              marginTop: '1rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-grey-200)',
              color: 'var(--color-grey-800)',
            }
      }
    >
      {children}
    </Link>
  );
}
