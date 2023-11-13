import server from "./server.js";
import { createUsersTable } from "./db.js";

createUsersTable();

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
  console.log("Listening to port " + PORT);
});
