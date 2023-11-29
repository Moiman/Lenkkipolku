import axios, { isAxiosError } from "axios";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import userService from "./userService";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const authAxios = axios.create({
  baseURL: "http://localhost:3000/",
});

const AxiosInterceptor = ({ children }: { children: React.ReactNode; }) => {
  const authContext = useContext(AuthContext);

  authAxios.interceptors.request.use(
    (config) => {
      const token = authContext.authState.token;
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
      if (!isAxiosError(err) || !err.config) {
        return Promise.reject(err);
      }
      const originalRequest = err.config;
      if (err.response?.status !== 401
        || !authContext.authState.refreshToken
      ) {
        return Promise.reject(err);
      } else if (originalRequest._retry) {

        authContext.logout();
        return Promise.reject(err);
      }
      try {
        const res = await userService.refresh(authContext.authState.refreshToken);
        authContext.setAuthState({ authenticated: true, token: res.token, refreshToken: res.refreshToken });
        originalRequest._retry = true;
        originalRequest.headers.Authorization = "Bearer " + res.token;
        return axios(originalRequest);
      } catch (err2) {
        authContext.logout();
        return Promise.reject(err2);
      }
    }
  );

  return children;
};

export default authAxios;
export { AxiosInterceptor };
