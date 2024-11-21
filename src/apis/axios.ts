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
    const apiKey = "AIzaSyDJfBTk_t7Csg3RdKX4rq9QxT54BSbL9j8";
    config.params = {
      ...config.params,
      key: apiKey,
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
