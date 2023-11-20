const isAuthenticated = () => {
  return getToken() !== null;
};

const setTokens = (token: string, refreshToken: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
};

const getToken = () => {
  return localStorage.getItem("token");
};

const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

export {
  isAuthenticated,
  getToken,
  getRefreshToken,
  setTokens,
  clearTokens,
};
