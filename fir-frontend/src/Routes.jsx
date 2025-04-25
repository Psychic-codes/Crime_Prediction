import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";
import PoliceFileFIR from "./pages/Police-Fir";
import CitizenFIRForm from "./pages/CitizenFIRForm";
import PoliceFIRList from "./pages/PoliceFIRList";
import CitizenFIRList from "./pages/CitizenFIRList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/citizen/citizen-dashboard" element={<CitizenDashboard />}/>
      <Route path="/police/police-dashboard" element={<PoliceDashboard />}/>
      <Route path="/police/file-fir"  element={<PoliceFileFIR />}/>
      <Route path="/citizen/file-fir" element={<CitizenFIRForm/>} />
      <Route path="/police/filed-firs" element={ <PoliceFIRList /> } />
      <Route path="/citizen/filed-firs" element={ <CitizenFIRList /> } />

    </Routes>
  );
};

export default AppRoutes;
