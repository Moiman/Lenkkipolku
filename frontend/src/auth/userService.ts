import axios from "axios";
import api from "./AxiosProvider";

const baseUrl = "http://localhost:3000/users/";

interface IUser {
  username: string,
  password: string,
  confirmPassword?: string,
}

interface ITokens {
  token: string,
  refreshToken: string,
}

const register = async (user: IUser) => {
  const res = await axios.post(baseUrl + "register", user);
  return res.data as ITokens;
};

const login = async (user: IUser) => {
  const res = await axios.post(baseUrl + "login", user);
  return res.data as ITokens;
};

const refresh = async (refreshToken: string) => {
  const config = {
    headers: {
      Authorization: "Bearer " + refreshToken,
    }
  };
  const res = await axios.get(baseUrl + "refresh", config);
  return res.data as ITokens;
};

const remove = async () => {
  await api.delete(baseUrl + "delete");
};

export default { register, login, refresh, remove };
