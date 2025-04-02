import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

const PoliceFileFIR = () => {
  const [formData, setFormData] = useState({
    citizenEmail: "",
    description: "",
    typeOfCrime: "",
    location: "",
    placeOfCrime: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        "http://localhost:3000/api/fir/police",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("✅ FIR filed successfully!");
      setFormData({
        citizenEmail: "",
        description: "",
        typeOfCrime: "",
        location: "",
        placeOfCrime: "",
      });

      setTimeout(() => navigate("/police-dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "❌ Error filing FIR");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          🚔 File FIR as Police
        </h2>

        {error && (
          <p className="text-red-500 flex items-center mb-3">
            <FaExclamationCircle className="mr-2" /> {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 flex items-center mb-3">
            <FaCheckCircle className="mr-2" /> {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="citizenEmail"
            placeholder="Citizen's Email"
            value={formData.citizenEmail}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="typeOfCrime"
            placeholder="Type of Crime"
            value={formData.typeOfCrime}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="description"
            placeholder="Crime Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          ></textarea>

          <input
            type="text"
            name="placeOfCrime"
            placeholder="Place of Crime"
            value={formData.placeOfCrime}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="location"
            placeholder="Police Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            📄 File FIR
          </button>
        </form>
      </div>
    </div>
  );
};

export default PoliceFileFIR;
