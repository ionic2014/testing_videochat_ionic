import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  name: String,
  subtitle: String,
  image: String,
  rolesAllowed: [String],
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  radioUrl: String
});

export default mongoose.model("Room", RoomSchema);