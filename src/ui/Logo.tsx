import { Link } from 'react-router-dom';

export function Logo({ redirect }: { redirect: string }) {
  return (
    <Link to={redirect}>
      <img src="/logo.png" alt="Logo" style={{ width: '100%' }} />
    </Link>
  );
}
