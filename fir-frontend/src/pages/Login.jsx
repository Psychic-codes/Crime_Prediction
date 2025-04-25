import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const debouncedEmail = useDebounce(email);
  const debouncedPassword = useDebounce(password);

  const NaviagtionHandler = () =>{
    navigate("/register");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        email: debouncedEmail,
        password: debouncedPassword,
      });

      // Extract token and role
      const { token, role } = response.data;

      if (!token || !role) {
        throw new Error("Invalid login response");
      }

      // Save to local storage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Redirect based on role
      navigate(role === "CITIZEN" ? "/citizen/citizen-dashboard" : "/police/police-dashboard");

    } catch (err) {
      setError(err.response?.data?.error || err.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">Login</button>
        <button className="bg-blue-500 text-white w-full mt-2 p-2" onClick={NaviagtionHandler}>Create an Account</button>
      </form>
        
      </div>
    </div>
  );
};

export default Login;
