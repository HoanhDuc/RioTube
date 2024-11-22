import axios from "axios";

const baseURL = "https://youtube.googleapis.com/youtube/v3";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = localStorage.getItem("session");
    config.params = {
      ...config.params,
      key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    };

    if (session) {
      config.headers.Authorization = session;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
