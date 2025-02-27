import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PoliceFileFIR = () => {
    const [formData, setFormData] = useState({
        citizenEmail: "",
        description: "",
        typeOfCrime: "",
        location: "",
        placeOfCrime: ""
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
            const token = localStorage.getItem("token"); // Ensure police is authenticated
            const response = await axios.post("http://localhost:3000/api/fir/police", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess("FIR filed successfully");
            setFormData({ citizenEmail: "", description: "", typeOfCrime: "", location: "", placeOfCrime: "" });
            setTimeout(() => navigate("/police-dashboard"), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Error filing FIR");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">File FIR as Police</h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" name="citizenEmail" placeholder="Citizen Email" value={formData.citizenEmail} onChange={handleChange} required className="w-full p-2 border rounded mb-3" />
                <input type="text" name="typeOfCrime" placeholder="Type of Crime" value={formData.typeOfCrime} onChange={handleChange} required className="w-full p-2 border rounded mb-3" />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full p-2 border rounded mb-3"></textarea>
                <input type="text" name="placeOfCrime" placeholder="Place of Crime" value={formData.placeOfCrime} onChange={handleChange} required className="w-full p-2 border rounded mb-3" />
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required className="w-full p-2 border rounded mb-3" />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">File FIR</button>
            </form>
        </div>
    );
};

export default PoliceFileFIR;

