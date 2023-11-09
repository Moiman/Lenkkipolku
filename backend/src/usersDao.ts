import { executeQuery } from "./db.js";
import * as queries from "./userQueries.js";

const findAllUsers = async () => {
  console.log("Requesting all users...");
  const result = await executeQuery(queries.findAllUsers);
  const resultCount = result ? result.rows.length : 0;
  console.log(`Found ${resultCount} users.`);
  return result;
};

const findOneUser = async (id: string) => {
  console.log(`Requesting a user with id: ${id}...`);
  const result = await executeQuery(queries.findOneUser, [id]);
  if (result) {
    console.log(`Found ${result.rows.length} users.`);
  }
  return result;
};

const findUserWithUsername = async (username: string) => {
  console.log(`Requesting a user with usename: ${username}...`);
  const result = await executeQuery(queries.findUserWithUsername, [username]);
  if (result) {
    console.log(`Found ${result.rows.length} users.`);
  }
  return result;
};

const insertUser = async (user: {username: string, password: string}) => {
  try {
    const params = [user.username, user.password];
    console.log("Inserting new user...");
    const result = await executeQuery(queries.insertUser, params);
    console.log("New user inserted successfully.");
    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateUser = async (user: {id: number, password: string}) => {
  const params = [user.id, user.password];
  console.log(`Updating a user ${user.id}...`);
  const result = await executeQuery(queries.updateUser, params);
  console.log(`user ${user.id} updated successfully.`);
  return result;
};

const deleteUserById = async (id: string) => {
  console.log(`Deleting user with id: ${id}...`);
  const result = await executeQuery(queries.deleteUserById, [id]);
  console.log(`Deleted user with id: ${id}.`);
  return result;
};

export { findAllUsers, findOneUser, findUserWithUsername, insertUser, updateUser, deleteUserById };
