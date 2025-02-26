import axios from "axios";

const API_URL = "http://localhost:5000/api/fir"; // Change this if needed

export const fileCitizenFIR = async (firData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_URL}/citizen`, firData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
