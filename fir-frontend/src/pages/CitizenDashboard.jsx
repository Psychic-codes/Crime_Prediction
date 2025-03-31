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
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">🚔 Citizen Dashboard</h1>
        <div>
          <button
            className="bg-white text-blue-600 px-5 py-2 rounded-lg mx-2 font-semibold transition-transform transform hover:scale-105 hover:bg-gray-100"
            onClick={() => navigate("/citizen/file-fir")}
          >
            📄 File an FIR
          </button>
          <button
            className="bg-white text-blue-600 px-5 py-2 rounded-lg mx-2 font-semibold transition-transform transform hover:scale-105 hover:bg-gray-100"
            onClick={() => navigate("/citizen/citizen-fir-status")}
          >
            📊 Check Your FIRs
          </button>
        </div>
      </nav>

      {/* Beautiful Placeholder for Map */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-200 p-6">
        <div className="w-full max-w-4xl h-96 bg-gray-300 rounded-lg flex flex-col items-center justify-center shadow-lg border border-gray-400">
          <p className="text-gray-700 text-xl font-semibold">🗺️ Map will be added here soon...</p>
          <p className="text-gray-500">Stay tuned for real-time crime mapping!</p>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
