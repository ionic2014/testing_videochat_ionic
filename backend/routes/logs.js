import express from "express";
import Log from "../models/Log.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const logs = await Log.find({}).sort({ timestamp: -1 }).limit(500);
  res.json(logs);
});

router.get("/:username", async (req, res) => {
  const logs = await Log.find({ username: req.params.username }).sort({ timestamp: -1 }).limit(200);
  res.json(logs);
});

export default router;