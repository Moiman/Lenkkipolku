import express from "express";
import * as dao from "./pathsDao.js";

const router = express.Router();

router.get("/", async (req, res) => {
  if (!(req.user && "id" in req.user)) {
    return res.status(500).end();
  }
  const user_id = req.user.id as number;
  try {
    const paths = await dao.findAllPaths(user_id);
    return res.json(paths);
  } catch (err) {
    return res.status(500).end();
  }
});

router.get("/:id(\\d+)", async (req, res) => {
  if (!(req.user && "id" in req.user)) {
    return res.status(500).end();
  }
  const user_id = Number(req.user.id);
  const id = parseInt(req.params.id);
  if (isNaN(id) && id > 0) {
    return res.status(400).json({ error: "expected number param" });
  }
  try {
    const path = await dao.findPath(id, user_id);
    if(!path) {
      return res.status(404).end();
    }
    return res.json(path);
  } catch (err) {
    return res.status(500).end();
  }
});

router.post("/", async (req, res) => {
  if (!(req.user && "id" in req.user)) {
    return res.status(500).end();
  }
  const user_id = Number(req.user.id);

  const title = req.body.title;
  const path = req.body.path;
  if (typeof title !== "string" || typeof path !== "object") {
    return res.status(400).json({ error: "Missing title or path" });
  }
  try {
    const newPath = await dao.insertPath(user_id, title, path);
    return res.json(newPath);
  } catch (err) {
    return res.status(500).end();
  }
});

router.put("/:id(\\d+)", async (req, res) => {
  if (!(req.user && "id" in req.user)) {
    return res.status(500).end();
  }
  const user_id = Number(req.user.id);
  const id = parseInt(req.params.id);

  try {
    const oldPath = await dao.findPath(id, user_id);
    if (!oldPath) {
      return res.status(404).end();
    }
    const title = req.body.title ?? oldPath.title;
    const path = req.body.path ?? oldPath.path;
    if (typeof title !== "string" || typeof path !== "object") {
      return res.status(400).json({ error: "Missing title or path" });
    }
    const newPath = await dao.updatePath(id, user_id, title, path);
    if(!path) {
      return res.status(404).end();
    }
    return res.json(newPath);
  } catch (err) {
    return res.status(500).end();
  }
});

router.delete("/:id(\\d+)", async (req, res) => {
  if (!(req.user && "id" in req.user)) {
    return res.status(500).end();
  }
  const user_id = Number(req.user.id);
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "expected number param" });
  }
  try {
    const path = await dao.deletePath(id, user_id);
    if(!path) {
      return res.status(404).end();
    }
    return res.json(path);
  } catch (err) {
    return res.status(500).end();
  }
});

export default router;
