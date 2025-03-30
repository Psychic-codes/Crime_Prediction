import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Map will be added here soon...</p>
      </div>
    </div>
  );
};

export default CitizenDashboard;
