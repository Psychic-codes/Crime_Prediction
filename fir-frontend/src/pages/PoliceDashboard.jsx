import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaClipboardList, FaMapMarkedAlt } from "react-icons/fa";

const PoliceDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">🚔 Police Dashboard</h1>
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-100 transition"
            onClick={() => navigate("/police-file-fir")}
          >
            <FaFileAlt /> File FIR
          </button>
          <button
            className="flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-100 transition"
            onClick={() => navigate("/police/filed-firs")}
          >
            <FaClipboardList /> Update FIRs
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Welcome, Officer! 👮</h2>
        <p className="text-gray-500 text-lg">Monitor and manage FIRs efficiently.</p>

        {/* Placeholder for Map */}
        <div className="w-3/4 h-96 bg-gray-300 flex items-center justify-center rounded-lg shadow-lg">
          <FaMapMarkedAlt className="text-gray-500 text-6xl" />
          <p className="text-gray-600 ml-4 text-xl">Live Map (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;
