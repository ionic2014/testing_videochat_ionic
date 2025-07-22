import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Switch, Button, AppBar, Toolbar, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";

export default function SettingsMenu({ user, onBack }) {
  const [font, setFont] = useState(user.font || "Segoe UI");
  const [fontSize, setFontSize] = useState(user.fontSize || 16);
  const [sounds, setSounds] = useState(user.sounds ?? true);

  const handleSave = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/users/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, font, fontSize, sounds })
    }).then(() => alert("Impostazioni salvate!"));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#181c24" }}>
      <AppBar position="static" sx={{ background: "#282f3a" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={onBack}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Impostazioni Chat</Typography>
        </Toolbar>
      </AppBar>
      <Paper sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 4, borderRadius: "18px" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Preferenze Personali</Typography>
        <TextField fullWidth label="Font" value={font} onChange={e => setFont(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Dimensione Font" type="number" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography sx={{ mr: 2 }}>Suoni chat</Typography>
          <Switch checked={sounds} onChange={e => setSounds(e.target.checked)} />
        </Box>
        <Button variant="contained" color="primary" onClick={handleSave}>Salva</Button>
      </Paper>
    </Box>
  );
}