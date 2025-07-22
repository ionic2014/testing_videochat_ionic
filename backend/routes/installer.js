import express from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import User from "../models/User.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { dbUri, founderUser, founderPass, resetPass } = req.body;
  const envContent = `MONGO_URI=${dbUri}
PORT=5000
JWT_SECRET=${resetPass}
`;
  fs.writeFileSync(path.resolve("./.env"), envContent);
  const existing = await User.findOne({ username: founderUser });
  if (!existing) {
    const hashed = await bcrypt.hash(founderPass, 10);
    await User.create({
      username: founderUser,
      password: hashed,
      role: "founder",
      vip: true,
      permissions: {
        canKick: true,
        canBan: true,
        canViewLogs: true,
        canManageRooms: true,
        canManageUsers: true,
        canSeePrivateCams: true,
        canSendAnnouncements: true
      }
    });
  }
  res.status(200).json({ message: "Config salvata e founder creato." });
});

export default router;