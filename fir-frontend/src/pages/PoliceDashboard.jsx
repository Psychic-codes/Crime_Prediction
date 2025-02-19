import { useNavigate } from "react-router-dom";

const PoliceDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Police Dashboard</h1>
        <div>
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded-lg mx-2 font-semibold"
            onClick={() => navigate("/police-file-fir")}
          >
            File an FIR
          </button>
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded-lg mx-2 font-semibold"
            onClick={() => navigate("/police-fir-status")}
          >
            Update FIRs
          </button>
        </div>
      </nav>

      {/* Empty Dashboard (for now) */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Map will be added here soon...</p>
      </div>
    </div>
  );
};

export default PoliceDashboard;