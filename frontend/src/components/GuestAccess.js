import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

export default function GuestAccess({ onLogin, onBack }) {
  const [guestName, setGuestName] = useState("");
  const [error, setError] = useState("");

  const handleGuest = async () => {
    setError("");
    try {
      const res = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName, ip: "" })
      });
      const out = await res.json();
      if (out.error) setError(out.error);
      else onLogin(out);
    } catch (e) {
      setError("Errore di connessione");
    }
  };

  return (
    <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"linear-gradient(135deg, #181c24 60%, #1976d2 150%)"}}>
      <Paper elevation={5} sx={{p:4,minWidth:"330px",borderRadius:"18px",background:"#22283b"}}>
        <Typography variant="h5" sx={{mb:2}}>Accesso Guest</Typography>
        <TextField fullWidth label="Nickname" variant="outlined" value={guestName} onChange={e=>setGuestName(e.target.value)} sx={{mb:2}} />
        {error && <Typography color="error" sx={{mb:2}}>{error}</Typography>}
        <Button fullWidth variant="contained" color="primary" onClick={handleGuest} sx={{mb:2}}>Entra come Guest</Button>
        <Button fullWidth variant="text" onClick={onBack}>Torna indietro</Button>
      </Paper>
    </Box>
  );
}