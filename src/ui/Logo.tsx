import { Link } from 'react-router-dom';
import { LogoImage } from '../style/styles.ts';
import type { LogoProps } from '../utils/types.ts';

export function Logo({ redirect }: LogoProps) {
  return (
    <Link to={redirect}>
      <LogoImage src="/logo.png" alt="Logo" />
    </Link>
  );
}
