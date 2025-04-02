import { useEffect, useState } from "react";
import axios from "axios";
import CitizenFIRCard from "../components/CitizenFIRCard"; // Import the Citizen FIR Card

const CitizenFIRList = () => {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFIRs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/fir/citizen", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFirs(response.data.FIRs);
      } catch (err) {
        setError("Error fetching FIRs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFIRs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">📄 Your Filed FIRs</h2>

      {loading && <p className="text-gray-500">Loading FIRs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {firs.length > 0 ? (
          firs.map((fir) => <CitizenFIRCard key={fir._id} fir={fir} />)
        ) : (
          <p className="text-gray-600">No FIRs found.</p>
        )}
      </div>
    </div>
  );
};

export default CitizenFIRList;
