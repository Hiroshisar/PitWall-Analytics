import { Link } from 'react-router-dom';
import { LogoImage } from '../style/styles.ts';

export function Logo({ redirect }: { redirect: string }) {
  return (
    <Link to={redirect}>
      <LogoImage src="/logo.png" alt="Logo" />
    </Link>
  );
}
