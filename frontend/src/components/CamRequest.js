import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";

export default function CamRequest({ open, fromUser, onClose, onAccept }) {
  if (!open) return null;

  return (
    <Box sx={{ position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)", zIndex: 9999 }}>
      <Paper sx={{ p: 4, borderRadius: "18px", minWidth: 320 }}>
        <Typography variant="h6">Richiesta Cam</Typography>
        <Typography sx={{ mb: 2 }}>{fromUser} vuole vedere la tua webcam. Accetti?</Typography>
        <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={onAccept}>Accetta</Button>
        <Button variant="outlined" onClick={onClose}>Rifiuta</Button>
      </Paper>
    </Box>
  );
}