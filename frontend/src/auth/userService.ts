import axios from "axios";

const baseUrl = "http://localhost:3000/users/";

interface IUser {
  username: string,
  password: string,
  confirmPassword?: string,
}

const register = async (user: IUser) => {
  const res = await axios.post(baseUrl + "register", user);
  return res.data;
};

const login = async (user: IUser) => {
  const res = await axios.post(baseUrl + "login", user);
  return res.data;
};

const refresh = async (refreshToken: string) => {
  const config = {
    headers: {
      Authorization: "Bearer " + refreshToken,
    }
  };
  const res = await axios.get(baseUrl + "refresh", config);
  return res.data;
};

export default { register, login, refresh };
