import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import PoliceFileFIR from "./pages/Police-Fir";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/citizen-dashboard" element={<CitizenDashboard />}/>
      <Route path="/police-dashboard" element={<PoliceDashboard />}/>
      <Route path="/police-file-fir"  element={<PoliceFileFIR/>}/>
    </Routes>
  );
};

export default AppRoutes;
