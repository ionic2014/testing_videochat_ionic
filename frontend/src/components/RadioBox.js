import React from "react";
import { Box, Typography } from "@mui/material";

export default function RadioBox({ roomId }) {
  // In un'app reale, carichi la radio dalla room. Qui è esempio.
  const radioUrl = "https://stream.radioparadise.com/mp3-192"; // esempio
  return (
    <Box sx={{ ml: 2 }}>
      <Typography variant="body2" sx={{ color: "#21cbf3" }}>Radio:</Typography>
      <audio controls src={radioUrl} style={{ verticalAlign: 'middle', marginLeft: '8px', background: "#22283b", borderRadius: "8px" }} />
    </Box>
  );
}