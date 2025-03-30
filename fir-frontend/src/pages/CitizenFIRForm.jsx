import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fileCitizenFIR } from "../api/firApi";


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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fileCitizenFIR(formData);
      setSuccess(response.message);
      setFormData({
        citizenEmail: "",
        description: "",
        typeOfCrime: "",
        location: "",
        placeOfCrime: "",
      });
      setTimeout(() => navigate("/citizen-fir-status"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to file FIR");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">File an FIR</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="citizenEmail"
          value={formData.citizenEmail}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="typeOfCrime"
          value={formData.typeOfCrime}
          onChange={handleChange}
          placeholder="Type of Crime"
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the Incident"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="placeOfCrime"
          value={formData.placeOfCrime}
          onChange={handleChange}
          placeholder="Place of Crime"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Your Location"
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded font-semibold"
        >
          Submit FIR
        </button>
      </form>
    </div>
  );
};

export default CitizenFIRForm;
