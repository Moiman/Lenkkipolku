import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ContextType {
  token: string,
  setToken: React.Dispatch<React.SetStateAction<string>>,
}
const AuthContext = createContext<ContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode; }) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    refreshToken: null,
    authenticated: null,
  });
  const [token, setToken] = useState(localStorage.getItem("token") ?? "");

  useEffect(() => {
    console.log(token);
    if (token) {
      axios.defaults.headers.common.Authorization = "Bearer " + token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem("token");
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
