import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

export default function ChatBox({ messages, user, chatEndRef }) {
  return (
    <Box className="chatbox">
      {messages.map((msg, idx) => (
        <Box key={idx} sx={{ mb: 2, display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Avatar sx={{ bgcolor: msg.vip ? "#1976d2" : "#222", border: msg.vip ? "2px solid gold" : undefined }}>{msg.username[0]}</Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{
              color: msg.colors || "#fff",
              fontWeight: msg.vip ? "bold" : "normal",
              animation: msg.vip ? "colorCycle 2s infinite alternate" : undefined
            }}>
              {msg.username}
            </Typography>
            <Typography variant="body1">{msg.text}</Typography>
            <Typography variant="caption" sx={{ color: "#888", fontSize: "10px" }}>
              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
            </Typography>
          </Box>
        </Box>
      ))}
      <div ref={chatEndRef} />
    </Box>
  );
}