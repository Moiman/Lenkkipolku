import axios, { isAxiosError } from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import userService from "./userService";
import { setTokens } from "./authHelpers";

const authAxios = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

const AxiosInterceptor = ({ children }: { children: React.ReactNode; }) => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    authAxios.interceptors.request.use(
      (config) => {
        // const token = authContext.authState.token;
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

    authAxios.interceptors.response.use(res => res,
      async (err) => {
        const originalRequest = err.config;
        if (!isAxiosError(err)
          || err.response?.status !== 401
          || originalRequest._retry
          || !authContext.authState.refreshToken
        ) {
          return Promise.reject(err);
        }
        try {
          const res = await userService.refresh(authContext.authState.refreshToken);
          // TODO FIX THIS RACE CONDITION without localStorage.setItem
          // localStorage.setItem("token", res.token);
          // localStorage.setItem("refreshToken", res.refreshToken);
          setTokens(res.token, res.refreshToken);
          authContext.setAuthState({ authenticated: true, token: res.token, refreshToken: res.refreshToken });
          originalRequest._retry = true;
          return authAxios(originalRequest);
        } catch (err2) {
          return Promise.reject(err2);
        }
      }
    );
  }, [authContext]);

  return children;
};

export default authAxios;
export { AxiosInterceptor };
