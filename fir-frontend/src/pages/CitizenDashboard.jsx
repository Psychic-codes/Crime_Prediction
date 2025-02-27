import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CitizenFIRForm from "../components/CitizenFIRForm";

const CitizenDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "CITIZEN") {
      navigate("/login"); // Redirect to login if not a citizen
    }
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Citizen Dashboard</h1>
        <div>
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded-lg mx-2 font-semibold"
            onClick={() => navigate("/file-fir")}
          >
            File an FIR
          </button>
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded-lg mx-2 font-semibold"
            onClick={() => navigate("/citizen-fir-status")}
          >
            Check Your FIRs
          </button>
        </div>
      </nav>

      {/* FIR Filing Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-semibold mb-4">File an FIR</h2>
        <CitizenFIRForm />
      </div>
    </div>
  );
};

export default CitizenDashboard;
