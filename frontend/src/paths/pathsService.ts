import api from "./../auth/AxiosProvider";
import { IPath } from "./pathsTypes";

const getAll = async () => {
  const res = await api.get("paths/");
  return res.data as IPath[];
};

const newPath = async (title: string, path: object) => {
  const res = await api.post("paths/", { title, path });
  return res.data as IPath;
};

const deletePath = async (id: number) => {
  const res = await api.delete("paths/" + id);
  return res.data as IPath;
};

const updatePath = async (id: number, title: string, path: object) => {
  const res = await api.put("paths/" + id, { title, path });
  return res.data as IPath;
};

export default {
  getAll,
  newPath,
  deletePath,
  updatePath,
};
