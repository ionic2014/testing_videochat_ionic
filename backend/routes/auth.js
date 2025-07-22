import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Log from "../models/Log.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, ip } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: "Username già esistente!" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed, ip, lastLogin: new Date() });
  await Log.create({ action: "register", username, ip, timestamp: new Date() });
  res.json({ username: user.username });
});

router.post("/login", async (req, res) => {
  const { username, password, ip } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Utente non trovato" });
  if (user.banned) return res.status(403).json({ error: "Sei stato bannato!" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Password errata" });
  user.ip = ip;
  user.lastLogin = new Date();
  await user.save();
  await Log.create({ action: "login", username, ip, timestamp: new Date() });
  res.json({
    username: user.username,
    role: user.role,
    permissions: user.permissions,
    vip: user.vip,
    colors: user.colors,
    animatedColors: user.animatedColors,
    camEnabled: user.camEnabled,
    camPrivate: user.camPrivate,
    font: user.font,
    fontSize: user.fontSize,
    sounds: user.sounds,
    avatar: user.avatar
  });
});

router.post("/logout", async (req, res) => {
  const { username, ip } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    user.lastLogout = new Date();
    await user.save();
    await Log.create({ action: "logout", username, ip, timestamp: new Date() });
  }
  res.json({ ok: true });
});

router.post("/guest", async (req, res) => {
  const { guestName, ip } = req.body;
  const username = `guest_${guestName}_${Math.floor(Math.random() * 10000)}`;
  await Log.create({ action: "guest_login", username, ip, timestamp: new Date() });
  res.json({ username, role: "guest", vip: false, camEnabled: false, camPrivate: false });
});

export default router;