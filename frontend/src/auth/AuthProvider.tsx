import { createContext, useEffect, useState } from "react";
import { clearTokens, getRefreshToken, getToken, isAuthenticated, setTokens } from "./authHelpers";

interface IAuthState {
  token: string | null,
  refreshToken: string | null,
  authenticated: boolean,
}

interface ContextType {
  authState: IAuthState,
  setAuthState: React.Dispatch<React.SetStateAction<IAuthState>>,
  logout: () => void;
  getAccessToken: () => string | null;
}
const AuthContext = createContext<ContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode; }) => {
  const [authState, setAuthState] = useState({
    token: getToken(),
    refreshToken: getRefreshToken(),
    authenticated: isAuthenticated(),
  });

  useEffect(() => {
    if (authState.token && authState.refreshToken) {
      console.log("Setting tokens");
      setTokens(authState.token, authState.refreshToken);
    } else {
      console.log("Clearing tokens");
      clearTokens();
    }
  }, [authState]);

  const getAccessToken = () => {
    return authState.token;
  };

  const logout = () => {
    clearTokens();
    setAuthState({
      token: null,
      refreshToken: null,
      authenticated: false,
    });
    window.location.reload();
  };

  const contextValue = { authState, setAuthState, logout, getAccessToken };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
