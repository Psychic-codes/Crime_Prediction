import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import useDebounce from "../hooks/useDebounce";

export default function Register() {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CITIZEN",
    location: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Debounce input values to reduce unnecessary updates
  const debouncedUserData = useDebounce(userData, 500);

  // Memoized validation for better performance
  const isPasswordValid = useMemo(() => debouncedUserData.password.length >= 6, [debouncedUserData.password]);
  const isConfirmPasswordValid = useMemo(() => debouncedUserData.password === debouncedUserData.confirmPassword, [debouncedUserData.password, debouncedUserData.confirmPassword]);

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
      // ✅ Ensure the correct format for fullname
      const payload = {
        fullname: {
          firstname: debouncedUserData.firstname,
          lastname: debouncedUserData.lastname,
        },
        email: debouncedUserData.email,
        password: debouncedUserData.password,
        role: debouncedUserData.role,
        location: debouncedUserData.location,
      };

      const response = await register(payload);
      console.log(response.data)

      if (!response.data.role) {
        throw new Error("Role missing in response");
      }

      // Redirect based on role
      if (response.data.role === "CITIZEN") {
        navigate("/citizen/citizen-dashboard");
      } else if (response.data.role === "POLICE") {
        navigate("/police/police-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Register</h2>
        
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Firstname & Lastname */}
        <div className="flex gap-2">
          <input type="text" name="firstname" placeholder="First Name" value={userData.firstname} onChange={handleChange} className="border p-2 w-1/2 rounded" required />
          <input type="text" name="lastname" placeholder="Last Name" value={userData.lastname} onChange={handleChange} className="border p-2 w-1/2 rounded" required />
        </div>

        {/* Email */}
        <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} className="border p-2 w-full rounded mt-2" required />

        {/* Password */}
        <input type="password" name="password" placeholder="Password (Min 6 chars)" value={userData.password} onChange={handleChange} className="border p-2 w-full rounded mt-2" required />

        {/* Confirm Password */}
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={userData.confirmPassword} onChange={handleChange} className="border p-2 w-full rounded mt-2" required />

        {/* Role Selection */}
        <select name="role" value={userData.role} onChange={handleChange} className="border p-2 w-full rounded mt-2">
          <option value="CITIZEN">CITIZEN</option>
          <option value="POLICE">POLICE</option>
        </select>

        {/* Location */}
        <input type="text" name="location" placeholder="Enter Your Location" value={userData.location} onChange={handleChange} className="border p-2 w-full rounded mt-2" required />

        {/* Submit Button */}
        <button type="submit" className={`p-2 w-full rounded mt-4 transition ${isPasswordValid && isConfirmPasswordValid ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`} disabled={!isPasswordValid || !isConfirmPasswordValid}>
          Register
        </button>
      </form>
    </div>
  );
}
