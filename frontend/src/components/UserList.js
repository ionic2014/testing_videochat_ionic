import React from "react";
import { Box, Avatar, Typography, Tooltip, IconButton, Menu, MenuItem, Chip } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

export default function UserList({ users, user, roomId, socket }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Menu open/close
  const handleMenuOpen = (event, u) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(u);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // Kick/Ban (for staff)
  const handleKick = () => {
    socket.emit("kickUser", { roomId, username: selectedUser.username });
    handleMenuClose();
  };
  const handleBan = () => {
    socket.emit("banUser", { roomId, username: selectedUser.username });
    handleMenuClose();
  };

  // Request cam
  const handleCamRequest = () => {
    socket.emit("requestCamView", { from: user.username, to: selectedUser.socketId });
    handleMenuClose();
  };

  return (
    <Box sx={{ width: "100%", p: 2, bgcolor: "#1c2230", height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2, color: "#21cbf3" }}>Utenti online</Typography>
      {users.map(u => (
        <Box key={u.username} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={u.username}>
            <Avatar src={u.avatar} sx={{ bgcolor: u.vip ? "#1976d2" : "#222", border: u.vip ? "2px solid gold" : undefined }} />
          </Tooltip>
          <Typography variant="body1" sx={{ fontWeight: u.role === "founder" ? "bold" : undefined, color: u.colors || "inherit" }}>
            {u.username}
          </Typography>
          {u.vip && <StarIcon sx={{ color: "gold", fontSize: 20, ml: 0.5 }} />}
          {u.camEnabled &&
            <Tooltip title={u.camPrivate ? "Cam privata" : "Cam pubblica"}>
              <IconButton size="small" color={u.camPrivate ? "warning" : "primary"} onClick={() => handleCamRequest()}>
                <CameraAltIcon />
              </IconButton>
            </Tooltip>
          }
          <IconButton size="small" onClick={e => handleMenuOpen(e, u)}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      ))}
      {/* Hamburger menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedUser && selectedUser.username !== user.username && (
          <>
            <MenuItem onClick={() => alert("Apri messaggio privato")}>Messaggio privato</MenuItem>
            {user.permissions?.canKick && <MenuItem onClick={handleKick}>Kick</MenuItem>}
            {user.permissions?.canBan && <MenuItem onClick={handleBan}>Ban</MenuItem>}
            {selectedUser.camEnabled && <MenuItem onClick={handleCamRequest}>Richiedi Cam</MenuItem>}
          </>
        )}
        {selectedUser && selectedUser.username === user.username && (
          <MenuItem disabled>Questo sei tu!</MenuItem>
        )}
      </Menu>
    </Box>
  );
}