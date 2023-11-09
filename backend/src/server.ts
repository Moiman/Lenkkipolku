import express from "express";
import cors from "cors";
import usersRouter from "./usersRouter.js";
import { requestLog, unknownEndpoint } from "./middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLog);
app.use("/users", usersRouter);
app.use(unknownEndpoint);

export default app;
