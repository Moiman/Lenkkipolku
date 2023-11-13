import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import * as dao from "./usersDao.js";

const router = express.Router();

const secret = process.env.SECRET!;
const refreshSecret = process.env.REFRESH_SECRET!;

router.get("/", async (_req, res) => {
  try {
    const users = await dao.findAllUsers();
    res.json(users);
    return;
  } catch (err) {
    res.status(500).end();
    return;
  }
});

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

    const payload = { id: newUser.id };
    const options = { expiresIn: "15m" };
    const token = jwt.sign(payload, secret, options);
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "7d" });

    return res.status(200).json({ token, refreshToken });
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
      const payload = { id: findUser.id };
      const options = { expiresIn: "15m" };
      const token = jwt.sign(payload, secret, options);
      const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "7d" });

      return res.status(200).json({ token, refreshToken });
    } else {
      return res.status(401).end();
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

    const payload = { id: decodedToken.id };
    const options = { expiresIn: "15m" };
    const newToken = jwt.sign(payload, secret, options);
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "7d" });

    return res.status(200).json({ token: newToken, refreshToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Expired token" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
