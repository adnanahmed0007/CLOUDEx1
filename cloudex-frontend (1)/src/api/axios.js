import axios from "axios";


export const SERVER_URL = "https://cloudex1-ektu.onrender.com" || "http://localhost:9090";
export const API_BASE_URL = `${SERVER_URL}/auth/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cloudex_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
