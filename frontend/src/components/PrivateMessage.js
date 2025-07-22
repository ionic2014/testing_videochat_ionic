import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

export default function PrivateMessage({ open, onClose, toUser, socket, user }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  if (!open) return null;

  socket.on("receivePrivateMessage", (msg) => {
    if (msg.from === toUser.username || msg.to === user.username)
      setMessages(m => [...m, msg]);
  });

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("sendPrivateMessage", {
      from: user.username,
      to: toUser.socketId,
      text: input.trim(),
      createdAt: new Date()
    });
    setMessages(m => [...m, { from: user.username, text: input.trim(), createdAt: new Date() }]);
    setInput("");
  };

  return (
    <Box sx={{ position: "fixed", top: "10%", left: "50%", transform: "translateX(-50%)", zIndex: 9999 }}>
      <Paper sx={{ p: 3, borderRadius: "18px", minWidth: 350 }}>
        <Typography variant="h6">Privato con {toUser.username}</Typography>
        <Box sx={{ maxHeight: 220, overflowY: "auto", mb: 2 }}>
          {messages.map((msg, idx) => (
            <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
              <b>{msg.from === user.username ? "Tu" : msg.from}:</b> {msg.text}
            </Typography>
          ))}
        </Box>
        <TextField
          fullWidth
          label="Messaggio privato"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={sendMessage} sx={{ mr: 1 }}>Invia</Button>
        <Button variant="text" onClick={onClose}>Chiudi</Button>
      </Paper>
    </Box>
  );
}