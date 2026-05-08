import { Route, BrowserRouter, Navigate, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Standings from './pages/Standings';
import MainLayout from './layout/MainLayout';
import { QueryClientProvider } from '@tanstack/react-query';
import GlobalStyles from './style/GlobalStyles';
import { queryClient } from './hooks/queryClient';
import { ToastContainer, Bounce } from 'react-toastify';
import Live from './pages/Live';
import Telemetry from './pages/Telemetry';
import { Statistics } from './pages/Statistics.tsx';
import { TyreStrategy } from './pages/TyreStrategy.tsx';
import Weather from './pages/Weather.tsx';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route element={<Home />}>
              <Route path="/home" element={null} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/live" element={<Live />} />
              <Route path="/telemetry" element={<Telemetry />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/tyre-strategy" element={<TyreStrategy />} />
              <Route path="/weather" element={<Weather />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
