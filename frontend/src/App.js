import React, { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import GuestAccess from "./components/GuestAccess.js";
import RoomList from "./components/RoomList.js";
import ChatRoom from "./components/ChatRoom.js";
import ControlPanel from "./components/ControlPanel.js";
import SettingsMenu from "./components/SettingsMenu.js";
import "./styles.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2" },
    background: { default: "#181c24", paper: "#22283b" }
  },
  typography: {
    fontFamily: "'Segoe UI', Arial, sans-serif"
  }
});

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login"); // login, register, guest, roomlist, chat, controlpanel, settings
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (user && screen === "login") setScreen("roomlist");
  }, [user, screen]);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    setScreen("roomlist");
  };
  const handleLogout = () => {
    setUser(null);
    setScreen("login");
    setRoomId(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {screen === "login" && <Login onLogin={handleLogin} onRegister={() => setScreen("register")} onGuest={() => setScreen("guest")} />}
      {screen === "register" && <Register onLogin={handleLogin} onBack={() => setScreen("login")} />}
      {screen === "guest" && <GuestAccess onLogin={handleLogin} onBack={() => setScreen("login")} />}
      {screen === "roomlist" && <RoomList user={user} onEnterRoom={(roomId) => { setRoomId(roomId); setScreen("chat"); }} onOpenPanel={() => setScreen("controlpanel")} />}
      {screen === "chat" && <ChatRoom user={user} roomId={roomId} onBack={() => setScreen("roomlist")} onOpenSettings={() => setScreen("settings")} />}
      {screen === "controlpanel" && <ControlPanel user={user} onBack={() => setScreen("roomlist")} />}
      {screen === "settings" && <SettingsMenu user={user} onBack={() => setScreen("chat")} />}
    </ThemeProvider>
  );
}
export default App;