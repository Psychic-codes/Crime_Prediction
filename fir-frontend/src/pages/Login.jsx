import { useMemo, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import {useNavigate} from "react-router-dom"
import { login } from "../services/authService";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const debouncedEmail = useDebounce(email);
  const debouncedPassword = useDebounce(password);

  // Memoize the login payload to avoid unnecessary recalculations
  const loginPayload = useMemo(
    () => ({
      email: debouncedEmail,
      password: debouncedPassword,
    }),
    [debouncedEmail, debouncedPassword]
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(loginPayload);

      // Save token & role
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      // Redirect based on role
      if (response.data.role === "CITIZEN") {
        navigate("/citizen-dashboard");
      } else if (response.data.role === "POLICE") {
        navigate("/police-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

    
    return ( 
        <>
          <div className="flex justify-center items-center h-screen bg-gray-100">
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
      </form>
    </div>
        </>
    );
}
 
export default Login;