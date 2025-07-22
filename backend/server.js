import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import fs from "fs";
import multer from "multer";

import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import roomsRouter from "./routes/rooms.js";
import controlPanelRouter from "./routes/controlpanel.js";
import logsRouter from "./routes/logs.js";
import installerRouter from "./routes/installer.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer per upload (emoticon/audio)
const upload = multer({ dest: path.join(__dirname, "uploads") });
app.post("/api/upload/emoticon", upload.single("file"), (req, res) => {
  // Salva percorso e ritorna il file
  res.json({ url: "/uploads/" + req.file.filename });
});
app.post("/api/upload/audio", upload.single("file"), (req, res) => {
  res.json({ url: "/uploads/" + req.file.filename });
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connesso"))
  .catch((err) => console.error("Errore MongoDB:", err));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/controlpanel", controlPanelRouter);
app.use("/api/logs", logsRouter);
app.use("/api/installer", installerRouter);

// Servi la cartella installer come statico
app.use("/installer", express.static(path.join(__dirname, "installer")));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Backend attivo su http://localhost:${port}`);
});

// --- SOCKET.IO: UTENTI ONLINE, CHAT, VIDEO, ANNUNCI, KICK/BAN LIVE ---
const io = new Server(server, { cors: { origin: "*" } });

let onlineUsers = {}; // { roomId: [ { username, role, vip, colors, camEnabled, socketId, camPrivate } ] }

io.on("connection", (socket) => {
  // User join room
  socket.on("joinRoom", ({ roomId, username, role, vip, colors, camEnabled, camPrivate }) => {
    socket.join(roomId);
    if (!onlineUsers[roomId]) onlineUsers[roomId] = [];
    if (!onlineUsers[roomId].some(u => u.username === username)) {
      onlineUsers[roomId].push({ username, role, vip, colors, camEnabled, camPrivate, socketId: socket.id });
    }
    io.to(roomId).emit("updateUserList", onlineUsers[roomId]);
    socket.roomId = roomId;
    socket.username = username;
  });

  // User leave room
  socket.on("leaveRoom", ({ roomId, username }) => {
    socket.leave(roomId);
    if (onlineUsers[roomId]) {
      onlineUsers[roomId] = onlineUsers[roomId].filter(u => u.username !== username);
      io.to(roomId).emit("updateUserList", onlineUsers[roomId]);
    }
  });

  // Kick/Ban live
  socket.on("kickUser", ({ roomId, username }) => {
    if (onlineUsers[roomId]) {
      const target = onlineUsers[roomId].find(u => u.username === username);
      if (target) {
        io.to(target.socketId).emit("kicked");
        onlineUsers[roomId] = onlineUsers[roomId].filter(u => u.username !== username);
        io.to(roomId).emit("updateUserList", onlineUsers[roomId]);
      }
    }
  });

  socket.on("banUser", ({ roomId, username }) => {
    if (onlineUsers[roomId]) {
      const target = onlineUsers[roomId].find(u => u.username === username);
      if (target) {
        io.to(target.socketId).emit("banned");
        onlineUsers[roomId] = onlineUsers[roomId].filter(u => u.username !== username);
        io.to(roomId).emit("updateUserList", onlineUsers[roomId]);
      }
    }
  });

  // Webcam status
  socket.on("camStatusChange", ({ roomId, username, camEnabled, camPrivate }) => {
    if (onlineUsers[roomId]) {
      onlineUsers[roomId] = onlineUsers[roomId].map(u =>
        u.username === username ? { ...u, camEnabled, camPrivate } : u
      );
      io.to(roomId).emit("updateUserList", onlineUsers[roomId]);
    }
    // Log cam open/close
    // ... salva su Log
  });

  // Cam request (richiesta visione cam)
  socket.on("requestCamView", ({ from, to }) => {
    // Invia richiesta solo se la cam è abilitata
    io.to(to).emit("camViewRequest", { from });
  });

  // Chatbox
  socket.on("sendMessage", (data) => {
    io.to(data.roomId).emit("receiveMessage", data);
    // Logga azione in DB (messaggio in chat)
    // ... aggiungi qui salvataggio su Log
  });

  // Messaggi privati
  socket.on("sendPrivateMessage", (data) => {
    io.to(data.toSocketId).emit("receivePrivateMessage", data);
    // Logga azione in DB (messaggio privato)
    // ... aggiungi qui salvataggio su Log
  });

  // Annunci
  socket.on("sendAnnouncement", (data) => {
    io.emit("receiveAnnouncement", data);
    // Logga annuncio
    // ... aggiungi qui salvataggio su Log
  });

  // Messaggi vocali (audio)
  socket.on("sendVoiceMessage", (data) => {
    io.to(data.roomId).emit("receiveVoiceMessage", data);
    // Logga azione
    // ... aggiungi qui salvataggio su Log
  });

  // Upload emoticon/audio via socket (broadcast)
  socket.on("uploadEmoticon", (data) => {
    io.to(data.roomId).emit("newEmoticon", data);
    // Logga azione
    // ... aggiungi qui salvataggio su Log
  });
  socket.on("uploadAudio", (data) => {
    io.to(data.roomId).emit("newAudio", data);
    // Logga azione
    // ... aggiungi qui salvataggio su Log
  });

  // User disconnect
  socket.on("disconnect", () => {
    const { roomId, username } = socket;
    if (roomId && onlineUsers[roomId]) {
      onlineUsers[roomId] = onlineUsers[roomId].filter(u => u.socketId !== socket.id);
      io.to(roomId).emit("updateUserList", onlineUsers[roomId]);
    }
  });
});