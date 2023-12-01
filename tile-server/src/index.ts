import express from "express";
import cors from "cors";
import tilesRouter from "./tilesRouter.js";
import { requestLog, unknownEndpoint } from "./middleware.js";

const app = express();

app.use(requestLog);
app.use(cors());
app.use(express.static("public"));

app.use("/", tilesRouter);

app.use(unknownEndpoint);

const PORT = process.env.TILESERVER_PORT ?? 8081;
console.log("Listening on port: " + PORT);
app.listen(PORT);
