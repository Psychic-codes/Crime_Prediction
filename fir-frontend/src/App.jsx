import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenFIRForm from "./components/CitizenFIRForm";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* 👈 Default Home Route */}
        <Route path="/register" element={<Register />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/file-fir" element={<CitizenFIRForm />} />
      </Routes>
    </Router>
  );
};

export default App;


