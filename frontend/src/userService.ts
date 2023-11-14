import axios from "axios";

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
  const res = await axios.post(baseUrl + "login", user);
  console.log(res.data);
  return res.data;
};

export default { register, login };
