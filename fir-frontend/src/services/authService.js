import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    
    if (response.data.success) {
      storeAuthData(response.data.token);
    }

    return response;
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    
    if (response.data.success) {
      storeAuthData(response.data.token);
    }

    return response;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Store token & role in LocalStorage
const storeAuthData = (token) => {
  localStorage.setItem("token", token);

  // Decode JWT to get the user role
  const decodedToken = parseJwt(token);
  if (decodedToken && decodedToken.role) {
    localStorage.setItem("role", decodedToken.role);
  }
};

// 🔹 Helper function to decode JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return null;
  }
};

// 🔹 Logout function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};