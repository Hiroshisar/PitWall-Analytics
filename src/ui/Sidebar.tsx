import { StyledSidebar } from '../style/styles';
import { Logo } from './Logo.tsx';
import { Button } from './Button.tsx';

const menu_options = [
  { label: 'Live', to: '/live' },
  { label: 'Telemetry', to: '/telemetry' },
  { label: 'Championships', to: '/championships' },
  { label: 'Statistics', to: '/statistics' },
  { label: 'Tyre Strategy', to: '/tyre-strategy' },
  { label: 'Weather', to: '/weather' },
];

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo redirect={'/home'} />
      {menu_options.map((option) => (
        <Button key={option.to} to={option.to}>
          {option.label}
        </Button>
      ))}
    </StyledSidebar>
  );
}

export default Sidebar;
