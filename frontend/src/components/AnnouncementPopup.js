import React from "react";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AnnouncementPopup({ message, onClose }) {
  return (
    <Box sx={{ position: "fixed", top: 40, left: "50%", transform: "translateX(-50%)", zIndex: 9999 }}>
      <Paper sx={{ px: 5, py: 3, borderRadius: "18px", bgcolor: "#1976d2", color: "#fff", boxShadow: 6, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">{message.text || message}</Typography>
        <IconButton sx={{ color: "#fff" }} onClick={onClose}><CloseIcon /></IconButton>
      </Paper>
    </Box>
  );
}