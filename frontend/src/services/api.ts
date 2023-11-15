import axios, { isAxiosError } from "axios";
import userService from "../auth/userService";

const instance = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(res => res,
  async (err) => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!isAxiosError(err)
      || err.response?.status !== 401
      || err.config?._retry
      || !refreshToken
    ) {
      return Promise.reject(err);
    }
    try {
      const res = await userService.refresh();
      console.log("moi");

      localStorage.setItem("token", res.token);
      localStorage.setItem("refreshToken", res.refreshToken);
      console.log(err.config);

      const originalRequest = err.config;
      originalRequest._retry = true;
      return instance(originalRequest);
    } catch (err2) {
      return Promise.reject(err2);
    }
  }
);

export default instance;
