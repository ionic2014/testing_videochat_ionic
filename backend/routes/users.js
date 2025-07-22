import express from "express";
import User from "../models/User.js";
import Log from "../models/Log.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find({}, "username role vip banned colors animatedColors ip camEnabled camPrivate avatar lastLogin lastLogout");
  res.json(users);
});

router.post("/kick", async (req, res) => {
  const { username, by } = req.body;
  // Kick via socket gestito in server.js
  await Log.create({ action: "kick", username, target: by, timestamp: new Date() });
  res.json({ ok: true });
});

router.post("/ban", async (req, res) => {
  const { username, by } = req.body;
  await User.updateOne({ username }, { banned: true });
  await Log.create({ action: "ban", username, target: by, timestamp: new Date() });
  res.json({ ok: true });
});

router.post("/unban", async (req, res) => {
  const { username } = req.body;
  await User.updateOne({ username }, { banned: false });
  await Log.create({ action: "unban", username, timestamp: new Date() });
  res.json({ ok: true });
});

router.post("/role", async (req, res) => {
  const { username, role, customRole, permissions } = req.body;
  await User.updateOne({ username }, { role, customRole, permissions });
  await Log.create({ action: "role_change", username, message: role, timestamp: new Date() });
  res.json({ ok: true });
});

router.post("/vip", async (req, res) => {
  const { username, vip, animatedColors } = req.body;
  await User.updateOne({ username }, { vip, animatedColors });
  await Log.create({ action: "vip_change", username, message: String(vip), timestamp: new Date() });
  res.json({ ok: true });
});

// Impostazioni utente locale (font, suoni, dimensione carattere)
router.post("/settings", async (req, res) => {
  const { username, font, fontSize, sounds } = req.body;
  await User.updateOne({ username }, { font, fontSize, sounds });
  res.json({ ok: true });
});

// Avatar
router.post("/avatar", async (req, res) => {
  const { username, avatar } = req.body;
  await User.updateOne({ username }, { avatar });
  res.json({ ok: true });
});

export default router;