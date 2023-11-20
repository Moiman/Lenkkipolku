import api from "./../auth/AxiosProvider";

const getAll = async () => {
  const res = await api.get("paths/");
  return res.data;
};

const newPath = async (title: string, path: object) => {
  const res = await api.post("paths/", { title, path });
  return res.data;
};

const deletePath = async (id: number) => {
  const res = await api.delete("paths/" + id);
  return res.data;
};

const updatePath = async (id: number, title: string, path: object) => {
  const res = await api.put("paths/" + id, { title, path });
  return res.data;
};

export default {
  getAll,
  newPath,
  deletePath,
  updatePath,
};
