import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

export default function Register({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    try {
      const res = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, ip: "" })
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
        <Typography variant="h5" sx={{mb:2}}>Registrati</Typography>
        <TextField fullWidth label="Username" variant="outlined" value={username} onChange={e=>setUsername(e.target.value)} sx={{mb:2}} />
        <TextField fullWidth label="Password" type="password" variant="outlined" value={password} onChange={e=>setPassword(e.target.value)} sx={{mb:2}} />
        {error && <Typography color="error" sx={{mb:2}}>{error}</Typography>}
        <Button fullWidth variant="contained" color="primary" onClick={handleRegister} sx={{mb:2}}>Registrati</Button>
        <Button fullWidth variant="text" onClick={onBack}>Torna indietro</Button>
      </Paper>
    </Box>
  );
}