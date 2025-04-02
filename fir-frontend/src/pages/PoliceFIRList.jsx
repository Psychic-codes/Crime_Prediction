import { useState, useEffect } from "react";
import axios from "axios";
import FIRCard from "../components/FIRCard"; // Import FIRCard component

const PoliceFIRList = () => {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFIRs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/fir/police", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFirs(response.data.FIRs);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Error fetching FIRs");
      } finally {
        setLoading(false);
      }
    };

    fetchFIRs();
  }, []);

  const handleStatusUpdate = async (firId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/fir/police/updateStatus/${firId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFirs((prevFirs) =>
        prevFirs.map((fir) => (fir._id === firId ? { ...fir, status: response.data.fir.status } : fir))
      );
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">FIRs Assigned to Your Location</h2>
      {loading && <p>Loading FIRs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {firs.map((fir) => (
          <FIRCard key={fir._id} fir={fir} handleStatusUpdate={handleStatusUpdate} />
        ))}
      </div>
    </div>
  );
};

export default PoliceFIRList;

