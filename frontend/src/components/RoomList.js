import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardMedia, CardContent, CardActions, Button, AppBar, Toolbar, IconButton } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom.js";
import SettingsIcon from "@mui/icons-material/Settings.js";
import AddIcon from "@mui/icons-material/Add.js";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";

export default function RoomList({ user, onEnterRoom, onOpenPanel }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/rooms")
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      });
  }, []);

  return (
    <Box className="roomlist-bg" sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ background: "#282f3a" }}>
        <Toolbar>
          <MeetingRoomIcon sx={{mr:1}} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Scegli una Room</Typography>
          {user && user.permissions?.canManageRooms &&
            <IconButton color="inherit" onClick={onOpenPanel}><SettingsIcon /></IconButton>
          }
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flexWrap: "wrap", p: 3, gap: 3, justifyContent: "center" }}>
        {loading && <Typography sx={{mt:4}}>Caricamento...</Typography>}
        {rooms.map(room => (
          <Card key={room._id} sx={{ width: 350, mb: 3, bgcolor: "#22283b", borderRadius: "18px", boxShadow: 4 }}>
            <CardMedia component="img" height="160" image={room.image || "https://images.unsplash.com/photo-1519125323398-675f0ddb6308"} alt={room.name} />
            <CardContent>
              <Typography variant="h6">{room.name}</Typography>
              <Typography variant="body2" color="text.secondary">{room.subtitle}</Typography>
              <Typography variant="body2" color="primary" sx={{mt:1}}>
                Utenti: {/* Serve API o socket per utenti online in room */}
              </Typography>
            </CardContent>
            <CardActions>
              <Button fullWidth variant="contained" color="primary" onClick={() => onEnterRoom(room._id)}>
                Entra
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}