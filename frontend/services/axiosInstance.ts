import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

// Main axiosInstance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 300000 // Set timeout to 5 minutes
});

// Add a request interceptor to include the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("profile"); // Retrieve JWT token from localStorage

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Set Authorization header
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout: ", error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;