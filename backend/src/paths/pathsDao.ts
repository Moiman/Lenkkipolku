// import { QueryResult } from "pg";
import { executeQuery } from "../db.js";
import * as queries from "./pathsQueries.js";

type Path = undefined | {
  id: number,
  user_id: number,
  title: string,
  path: object,
  created_at: Date,
  updated_at: Date,
};

const findAllPaths = async (user_id: number) => {
  const result = await executeQuery(queries.findAllPaths, [user_id]);
  return result.rows as Path[];
};

const findPath = async (id: number, user_id: number) => {
  const result = await executeQuery(queries.findPath, [id, user_id]);
  return result.rows[0] as Path;
};

const insertPath = async (user_id: number, title: string, path: object) => {
  const params = [user_id, title, JSON.stringify(path)];
  const result = await executeQuery(queries.insertPath, params);
  return result.rows[0] as Path;
};

const updatePath = async (id: number, user_id: number, title: string, path: object) => {
  const params = [id, user_id, title, JSON.stringify(path)];
  const result = await executeQuery(queries.updatePath, params);
  return result.rows[0] as Path;
};

const deletePath = async (id: number, user_id: number) => {
  const params = [id, user_id];
  const result = await executeQuery(queries.deletePath, params);
  return result.rows[0] as Path;
};

export {
  findAllPaths,
  findPath,
  insertPath,
  updatePath,
  deletePath,
};
