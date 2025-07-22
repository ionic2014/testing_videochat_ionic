import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  action: String,
  username: String,
  target: String,
  roomId: String,
  message: String,
  ip: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Log", LogSchema);