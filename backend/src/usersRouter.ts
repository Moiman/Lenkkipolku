import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import * as dao from "./usersDao.js";

const router = express.Router();

const secret = process.env.SECRET!;

router.get("/", async (req, res) => {
  const result = await dao.findAllUsers();
  res.json(result.rows);
});

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const findUser = await dao.findUserWithUsername(username);
    if (findUser.rowCount! > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }
    const hash = await argon2.hash(password);
    const user = { username: username, password: hash };

    await dao.insertUser(user);

    const payload = { username: username };
    const options = { expiresIn: "15m" };
    const token = jwt.sign(payload, secret, options);
    const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

    return res.status(200).json({ token, refreshToken });
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const findUser = await dao.findUserWithUsername(username);
    if (findUser.rowCount! > 0 && await argon2.verify(findUser.rows[0].password, password)) {
      const payload = { username: username };
      const options = { expiresIn: "15m" };
      const token = jwt.sign(payload, secret, options);
      const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

      return res.status(200).json({ token, refreshToken });

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
    const decodedToken = jwt.verify(token, secret);

    if (typeof decodedToken === "string") {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await dao.findUserWithUsername(decodedToken.username);
    if (user.rowCount! > 0) {
      return res.status(401).json({ error: "Invalid token, no such username" });
    }

    const payload = { username: decodedToken.username };
    const options = { expiresIn: "15m" };
    const newToken = jwt.sign(payload, secret, options);
    const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

    return res.status(200).json({ token: newToken, refreshToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Expired token" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
