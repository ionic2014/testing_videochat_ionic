import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Tabs, Tab, Button, TextField, Switch, MenuItem, AppBar, Toolbar, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";

export default function ControlPanel({ user, onBack }) {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [config, setConfig] = useState({});

  // Fetch on mount
  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/users").then(res => res.json()).then(setUsers);
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/rooms").then(res => res.json()).then(setRooms);
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/controlpanel/config").then(res => res.json()).then(setConfig);
  }, []);

  // Users tab: kick/ban/vip/role
  const handleBan = (username) => {
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/users/ban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, by: user.username })
    }).then(() => alert("Bannato!"));
  };

  // Rooms tab: create/delete
  const [newRoom, setNewRoom] = useState({ name: "", subtitle: "", image: "", radioUrl: "", rolesAllowed: ["user", "vip"] });
  const handleCreateRoom = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/rooms/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newRoom, createdBy: user.username })
    }).then(() => alert("Room creata!"));
  };

  // Config tab: update config (grafica)
  const handleConfigSave = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/controlpanel/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    }).then(() => alert("Config salvata!"));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#181c24" }}>
      <AppBar position="static" sx={{ background: "#282f3a" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={onBack}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Pannello di Controllo</Typography>
        </Toolbar>
      </AppBar>
      <Paper sx={{ maxWidth: 1000, mx: "auto", mt: 4, p: 3, borderRadius: "18px" }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Utenti" />
          <Tab label="Rooms" />
          <Tab label="Configurazione Grafica" />
        </Tabs>
        {/* Tab 0: Users */}
        {tab === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Gestione Utenti</Typography>
            {users.map(u => (
              <Box key={u.username} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography sx={{ fontWeight: "bold", color: u.role === "founder" ? "gold" : undefined }}>{u.username}</Typography>
                <Typography>{u.role}</Typography>
                <Switch checked={u.vip} disabled />
                <Button disabled={u.role === "founder"} onClick={() => handleBan(u.username)}>Ban</Button>
              </Box>
            ))}
          </Box>
        )}
        {/* Tab 1: Rooms */}
        {tab === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Gestione Rooms</Typography>
            <Box sx={{ mb: 3 }}>
              <TextField label="Nome Room" value={newRoom.name} onChange={e => setNewRoom(r=>({...r,name:e.target.value}))} sx={{mr:2}} />
              <TextField label="Sottotitolo" value={newRoom.subtitle} onChange={e => setNewRoom(r=>({...r,subtitle:e.target.value}))} sx={{mr:2}} />
              <TextField label="Immagine" value={newRoom.image} onChange={e => setNewRoom(r=>({...r,image:e.target.value}))} sx={{mr:2}} />
              <TextField label="Radio URL" value={newRoom.radioUrl} onChange={e => setNewRoom(r=>({...r,radioUrl:e.target.value}))} sx={{mr:2}} />
              <Button onClick={handleCreateRoom}>Crea Room</Button>
            </Box>
            {rooms.map(r => (
              <Box key={r._id} sx={{ mb: 2 }}>
                <Typography>{r.name}</Typography>
                <Typography variant="body2" color="text.secondary">{r.subtitle}</Typography>
              </Box>
            ))}
          </Box>
        )}
        {/* Tab 2: Configurazione Grafica */}
        {tab === 2 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Personalizza Grafica</Typography>
            <TextField label="Colore Sfondo Chat" value={config.chatTheme || ""} onChange={e => setConfig(c=>({...c,chatTheme:e.target.value}))} sx={{mr:2}} />
            <TextField label="Colore Sfondo Userlist" value={config.userlistBg || ""} onChange={e => setConfig(c=>({...c,userlistBg:e.target.value}))} sx={{mr:2}} />
            <TextField label="Colore Sfondo Chatbox" value={config.chatboxBg || ""} onChange={e => setConfig(c=>({...c,chatboxBg:e.target.value}))} sx={{mr:2}} />
            <TextField label="Colore Testo" value={config.textColor || ""} onChange={e => setConfig(c=>({...c,textColor:e.target.value}))} sx={{mr:2}} />
            <Button onClick={handleConfigSave}>Salva</Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}