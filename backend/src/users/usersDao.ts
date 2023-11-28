// import { QueryResult } from "pg";
import { executeQuery } from "../db.js";
import * as queries from "./usersQueries.js";

type User = undefined | {
  id: number,
  username: string,
  password: string,
  created_at: Date,
  updated_at: Date,
};

const findAllUsers = async () => {
  const result = await executeQuery(queries.findAllUsers);
  return result.rows as User[];
};

const findOneUser = async (id: number) => {
  const result = await executeQuery(queries.findOneUser, [id]);
  return result.rows[0] as User;
};

const findUserWithUsername = async (username: string) => {
  const result = await executeQuery(queries.findUserWithUsername, [username]);
  return result.rows[0] as User;
};

const insertUser = async (username: string, passwordHash: string) => {
  const params = [username, passwordHash];
  const result = await executeQuery(queries.insertUser, params);
  return result.rows[0] as { id: number; };
};

const updateUser = async (id: number, password: string) => {
  const params = [id, password];
  const result = await executeQuery(queries.updateUser, params);
  return result;
};

const deleteUserById = async (id: number) => {
  const result = await executeQuery(queries.deleteUserById, [id]);
  return result;
};

export { findAllUsers, findOneUser, findUserWithUsername, insertUser, updateUser, deleteUserById };
