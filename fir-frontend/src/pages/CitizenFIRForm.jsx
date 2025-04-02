import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CitizenFIRForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    citizenEmail: "",
    description: "",
    typeOfCrime: "",
    location: "",
    placeOfCrime: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    console.log("Submitting FIR:", formData); // Debugging Log

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/fir/citizen",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("FIR Response:", response.data); // Debugging Log

      setSuccess(response.data.message);
      setFormData({
        citizenEmail: "",
        description: "",
        typeOfCrime: "",
        location: "",
        placeOfCrime: "",
      });

      setTimeout(() => navigate("/citizen-fir-status"), 2000);
    } catch (err) {
      console.error("Error filing FIR:", err); // Debugging Log
      setError(err.response?.data?.error || "Failed to file FIR. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 shadow-lg rounded-lg mt-10 border border-gray-300">
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">📄 File an FIR</h2>

      {error && <p className="text-red-500 bg-red-100 p-2 rounded text-center">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-2 rounded text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-semibold">Your Email</label>
          <input
            type="email"
            name="citizenEmail"
            value={formData.citizenEmail}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Type of Crime</label>
          <input
            type="text"
            name="typeOfCrime"
            value={formData.typeOfCrime}
            onChange={handleChange}
            placeholder="E.g., Theft, Assault, Fraud"
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Incident Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the incident in detail..."
            required
            className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold">Place of Crime</label>
            <input
              type="text"
              name="placeOfCrime"
              value={formData.placeOfCrime}
              onChange={handleChange}
              placeholder="E.g., Market, Street, Home"
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Your Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your current location"
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Submitting..." : "🚔 Submit FIR"}
        </button>
      </form>
    </div>
  );
};

export default CitizenFIRForm;
