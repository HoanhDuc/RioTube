import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const baseURL = "https://phimapi.com/";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isUnauthorized = false;

axiosInstance.interceptors.request.use(
  async (config) => {
    if (isUnauthorized) {
      return Promise.reject(new Error("User is unauthorized"));
    }

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
      isUnauthorized = true;
      signOut();
    } else {
      if (error.response?.status !== 401) {
        signOut();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
