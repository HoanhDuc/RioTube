import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "sonner";

const baseURL = "https://youtube.googleapis.com/youtube/v3";

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
      toast.dismiss();
      toast.error("Token has expired. Please login again!", {
        style: {
          background: "#ff0123",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "12px",
          border: "none",
        },
      });
      signOut();
    } else {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "An unexpected error occurred";

      if (error.response?.status !== 401) {
        toast.dismiss();
        toast.error(errorMessage, {
          style: {
            background: "#ff0123",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "12px",
            border: "none",
          },
        });
        signOut();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
