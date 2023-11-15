import axios from "axios";
import api from "../services/api";

const baseUrl = "http://localhost:3000/users/";

interface IUser {
  username: string,
  password: string,
  confirmPassword?: string,
}

const register = async (user: IUser) => {
  const res = await axios.post(baseUrl + "register", user);
  console.log(res.data);
  return res.data;
};

const login = async (user: IUser) => {
  const res = await api.post(baseUrl + "login", user);
  console.log(res.data);
  return res.data;
};

const refresh = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const config = {
    headers: {
      Authorization: "Bearer " + refreshToken,
    }
  };
  const res = await axios.get(baseUrl + "refresh", config);
  console.log(res.data);
  return res.data;
};

export default { register, login, refresh };
