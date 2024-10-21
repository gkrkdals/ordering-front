import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ClientPage from "@src/pages/client/ClientPage";
import ManagerPage from "@src/pages/manager/ManagerPage";
import LoginPage from "@src/pages/login/LogInPage.tsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/client" element={<ClientPage />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/rider" element={<ManagerPage />} />
        <Route path="/cook" element={<ManagerPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<Navigate replace to='/login' />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;