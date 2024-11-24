import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const baseURL = "https://youtube.googleapis.com/youtube/v3";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    config.params = {
      ...config.params,
      key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    };

    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("Token was expired! Please re-login to using app.");
      signOut();
    }

    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject(errorMessage);
  }
);

export default axiosInstance;
