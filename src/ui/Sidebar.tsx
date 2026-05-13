import { useEffect, useState } from 'react';
import {
  SidebarHeader,
  SidebarIconButton,
  SidebarOpenButton,
  SidebarSlot,
  StyledSidebar,
} from '../style/styles';
import { Logo } from './Logo.tsx';
import Button from './Button.tsx';
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from 'react-icons/ri';

const reducedScreenQuery = '(max-width: 900px)';

const menu_options = [
  { label: 'Live', to: '/live' },
  { label: 'Telemetry', to: '/telemetry' },
  { label: 'Statistics', to: '/statistics' },
  { label: 'Tyre Strategy', to: '/tyre-strategy' },
  { label: 'Weather', to: '/weather' },
  { label: 'Standings', to: '/standings' },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return true;

    return !window.matchMedia(reducedScreenQuery).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedScreenQuery);

    const handleScreenChange = (event: MediaQueryListEvent) => {
      setIsOpen(!event.matches);
    };

    mediaQuery.addEventListener('change', handleScreenChange);

    return () => {
      mediaQuery.removeEventListener('change', handleScreenChange);
    };
  }, []);

  return (
    <SidebarSlot $isOpen={isOpen}>
      <StyledSidebar $isOpen={isOpen}>
        <SidebarHeader>
          <Logo redirect={'/home'} />
          <SidebarIconButton
            type="button"
            aria-label="Chiudi menu laterale"
            onClick={() => setIsOpen(false)}
          >
            <RiSidebarFoldLine />
          </SidebarIconButton>
        </SidebarHeader>

        {menu_options.map((option) => (
          <Button type="link" key={option.to} to={option.to}>
            {option.label}
          </Button>
        ))}
      </StyledSidebar>

      {!isOpen && (
        <SidebarOpenButton
          type="button"
          aria-label="Apri menu laterale"
          onClick={() => setIsOpen(true)}
        >
          <RiSidebarUnfoldLine />
        </SidebarOpenButton>
      )}
    </SidebarSlot>
  );
}

export default Sidebar;
