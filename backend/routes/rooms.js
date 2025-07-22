import express from "express";
import Room from "../models/Room.js";
import Log from "../models/Log.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const rooms = await Room.find({});
  res.json(rooms);
});

router.post("/create", async (req, res) => {
  const { name, subtitle, image, rolesAllowed, createdBy, radioUrl } = req.body;
  const room = await Room.create({ name, subtitle, image, rolesAllowed, createdBy, radioUrl });
  await Log.create({ action: "room_create", username: createdBy, message: name, timestamp: new Date() });
  res.json(room);
});

router.post("/delete", async (req, res) => {
  const { roomId, deletedBy } = req.body;
  await Room.deleteOne({ _id: roomId });
  await Log.create({ action: "room_delete", username: deletedBy, message: roomId, timestamp: new Date() });
  res.json({ ok: true });
});

export default router;