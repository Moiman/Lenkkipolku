import server from "./server.js";
import { createTables } from "./db.js";

createTables();

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
  console.log("Listening to port " + PORT);
});
