import { Button, StyledSidebar } from '../style/styles';

const menu_options = [
  'Dashboard',
  'Standings (WIP)',
  'Starting Grid (WIP)',
  'Tyre Strategy (WIP)',
  'Weather (WIP)',
  'Telemetry (WIP)',
];

function Sidebar() {
  return (
    <StyledSidebar>
      <img src="/logo.png" alt="Logo" style={{ width: '100%' }} />
      {menu_options.map((option) => (
        <Button key={option}>{option}</Button>
      ))}
    </StyledSidebar>
  );
}

export default Sidebar;
