import { Route, BrowserRouter, Navigate, Routes } from "react-router-dom";
import store from "./store/store";
import { Provider } from "react-redux";
import Dashboard from "./pages/Dashboard";
import Championships from "./pages/Championships";
import MainLayout from "./layout/MainLayout";
import { QueryClientProvider } from "@tanstack/react-query";
import GlobalStyles from "./style/GlobalStyles";
import { queryClient } from "./hooks/queryClient";
import { ToastContainer, Bounce } from "react-toastify";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
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
              <Route index element={<Navigate replace to={"dashboard"} />} />
              <Route path="/" element={<Dashboard />}>
                <Route path="championships" element={<Championships />} />
                <Route path="/*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
