import pg from "pg";
import { createUsersTableQuery } from "./users/usersQueries.js";
import { createPathsTableQuery } from "./paths/pathsQueries.js";

const { PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE } = process.env;

const pool = new pg.Pool({
  host: PG_HOST,
  port: Number(PG_PORT),
  user: PG_USERNAME,
  password: String(PG_PASSWORD),
  database: PG_DATABASE,
});

const executeQuery = async (query: string, parameters?: unknown[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, parameters);
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.stack);
      error.name = "dbError";
      throw error;
    } else {
      console.error(error);
      throw error;
    }
  } finally {
    client.release();
  }
};

const createTables = async () => {
  await executeQuery(createUsersTableQuery).catch((err) => {
    console.log(err);
  });
  console.log("Users table created");
  await executeQuery(createPathsTableQuery).catch((err) => {
    console.log(err);
  });
  console.log("Paths table created");
};

export { createTables, executeQuery, pool };
