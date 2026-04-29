import { Outlet } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';
import { StyledMainLayout } from '../style/styles';

function MainLayout() {
  return (
    <StyledMainLayout>
      <Sidebar />
      <Outlet />
    </StyledMainLayout>
  );
}

export default MainLayout;
