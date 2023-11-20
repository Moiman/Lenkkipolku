import api from "./../auth/AxiosProvider";

const getAll = async () => {
  const res = await api.get("paths/");
  return res.data;
};

const newPath = async (title: string, path: object) => {
  const res = await api.post("paths/", { title, path });
  return res.data;
};

// const login = async (user: IUser) => {
//   const res = await axios.post(baseUrl + "login", user);
//   return res.data;
// };

// const refresh = async (refreshToken: string) => {
//   const config = {
//     headers: {
//       Authorization: "Bearer " + refreshToken,
//     }
//   };
//   const res = await axios.get(baseUrl + "refresh", config);
//   return res.data;
// };

export default {
  getAll,
  newPath,
};
