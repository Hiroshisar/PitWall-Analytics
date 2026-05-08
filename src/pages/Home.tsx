import { Outlet, useLocation } from 'react-router-dom';
import Session from '../components/Session.tsx';
import { HomeTitleContainer } from '../style/styles.ts';

function Home() {
  const { pathname } = useLocation();

  if (pathname !== '/home') return <Outlet />;

  return (
    <div>
      <div>
        <Session />
      </div>

      <HomeTitleContainer>
        <h1>Choose a tool</h1>
      </HomeTitleContainer>
    </div>
  );
}

export default Home;
