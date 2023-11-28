import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import passport from "passport";
import * as dao from "./usersDao.js";
import { createNewTokens } from "./tokenHelpers.js";

const router = express.Router();

const refreshSecret = process.env.REFRESH_SECRET!;

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username
    || !password
    || typeof username !== "string"
    || typeof password !== "string") {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const findUser = await dao.findUserWithUsername(username);
    if (findUser) {
      return res.status(409).json({ error: "Username already exists" });
    }
    const hash = await argon2.hash(password);

    const newUser = await dao.insertUser(username, hash);

    const tokens = createNewTokens(newUser.id);

    return res.status(200).json(tokens);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password || typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const findUser = await dao.findUserWithUsername(username);
    if (findUser && await argon2.verify(findUser.password, password)) {
      const tokens = createNewTokens(findUser.id);
      return res.status(200).json(tokens);
    } else {
      return res.status(401).json({ error: "Username and password does not match" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

router.get("/refresh", async (req, res) => {
  const auth = req.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const token = auth.substring(7);
  try {
    const decodedToken = jwt.verify(token, refreshSecret);

    if (typeof decodedToken === "string") {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await dao.findOneUser(decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: "Invalid token, no such user" });
    }
    const tokens = createNewTokens(decodedToken.id);
    return res.status(200).json(tokens);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Expired token" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
});

router.put("/password", passport.authenticate("jwt", { session: false }), async (req, res) => {
  if (!(req.user && "id" in req.user)) {
    return res.status(500).end();
  }
  const user_id = Number(req.user.id);

  const password = req.body.password;
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Missing password" });
  }

  try {
    const hash = await argon2.hash(password);
    await dao.updateUser(user_id, hash);
    return res.status(204).end();
  } catch (err) {
    return res.status(500).end();
  }
});

router.delete("/delete", passport.authenticate("jwt", { session: false }), async (req,res) => {
  if (!(req.user && "id" in req.user)) {
    return res.status(500).end();
  }
  const user_id = Number(req.user.id);

  try {
    await dao.deleteUserById(user_id);
    return res.status(204).end();
  } catch (err) {
    return res.status(500).end();
  }
});

export default router;
