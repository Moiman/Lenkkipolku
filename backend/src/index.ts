import server from "./server.js";
import { createUsersTable, createPathsTable } from "./db.js";

createUsersTable();
createPathsTable();

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
  console.log("Listening to port " + PORT);
});
