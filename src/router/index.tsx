import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClientPage from "@src/pages/client/ClientPage";
import ManagerPage from "@src/pages/manager/ManagerPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/client" element={<ClientPage />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/rider" element={<ManagerPage />} />
        <Route path="/cook" element={<ManagerPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;