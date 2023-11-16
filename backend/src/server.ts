import express from "express";
import cors from "cors";
import passport from "passport";
import passportConfig from "./passport-config.js";
import usersRouter from "./users/usersRouter.js";
import pathsRouter from "./paths/pathsRouter.js";
import { requestLog, unknownEndpoint } from "./middleware.js";

passportConfig(passport);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", usersRouter);
app.use(requestLog);
app.use("/paths", passport.authenticate("jwt", { session: false }), pathsRouter);
// app.use("/paths", pathsRouter);
app.use(unknownEndpoint);

export default app;
