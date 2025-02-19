import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import useDebounce from "../hooks/useDebounce";

export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CITIZEN",
    location: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Debounced values to reduce unnecessary state updates
  const debouncedUserData = useDebounce(userData, 500);

  // Memoized validation for better performance
  const isPasswordValid = useMemo(() => {
    return debouncedUserData.password.length >= 6;
  }, [debouncedUserData.password]);

  const isConfirmPasswordValid = useMemo(() => {
    return debouncedUserData.password === debouncedUserData.confirmPassword;
  }, [debouncedUserData.password, debouncedUserData.confirmPassword]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isPasswordValid || !isConfirmPasswordValid) {
      setError("Passwords do not match or are too short.");
      return;
    }

    try {
      const response = await register(debouncedUserData);
      const { role } = response.data;
    if (!role) {
      throw new Error("Role missing in response");
    }
    if (response.data.role === "CITIZEN") {
      navigate("/citizen-dashboard");
    } else if (response.data.role === "POLICE") {
      navigate("/police-dashboard");
    }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={userData.name}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (Min 6 chars)"
          value={userData.password}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={userData.confirmPassword}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <select
          name="role"
          value={userData.role}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        >
          <option value="CITIZEN">CITIZEN</option>
          <option value="POLICE">POLICE</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Enter Your Location"
          value={userData.location}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <button
          type="submit"
          className={`p-2 w-full ${
            isPasswordValid && isConfirmPasswordValid ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!isPasswordValid || !isConfirmPasswordValid}
        >
          Register
        </button>
      </form>
    </div>
  );
}
