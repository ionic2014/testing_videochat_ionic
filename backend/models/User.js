import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  ip: String,
  role: { type: String, default: "user" },
  customRole: String,
  permissions: {
    canKick: { type: Boolean, default: false },
    canBan: { type: Boolean, default: false },
    canViewLogs: { type: Boolean, default: false },
    canManageRooms: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    canSeePrivateCams: { type: Boolean, default: false },
    canSendAnnouncements: { type: Boolean, default: false }
  },
  banned: { type: Boolean, default: false },
  vip: { type: Boolean, default: false },
  colors: { type: String, default: "#fff" },
  animatedColors: [String],
  camEnabled: { type: Boolean, default: false },
  camPrivate: { type: Boolean, default: false },
  avatar: String,
  font: { type: String, default: "Arial" },
  fontSize: { type: Number, default: 16 },
  sounds: { type: Boolean, default: true },
  customEmojis: [String],
  customAudio: [String],
  lastLogin: Date,
  lastLogout: Date
});

export default mongoose.model("User", UserSchema);