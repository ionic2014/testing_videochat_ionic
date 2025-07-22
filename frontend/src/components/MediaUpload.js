import React, { useRef } from "react";
import { Box, Button } from "@mui/material";

export default function MediaUpload({ type, roomId, socket }) {
  const fileRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const endpoint = type === "emoticon"
      ? "/api/upload/emoticon"
      : "/api/upload/audio";

    const res = await fetch(process.env.REACT_APP_BACKEND_URL + endpoint, {
      method: "POST",
      body: formData
    });
    const out = await res.json();
    if (out.url) {
      socket.emit(type === "emoticon" ? "uploadEmoticon" : "uploadAudio", {
        roomId,
        url: out.url
      });
      alert("File inviato!");
    }
  };

  return (
    <Box>
      <Button variant="outlined" onClick={() => fileRef.current.click()}>
        {type === "emoticon" ? "Carica Emoticon" : "Carica Audio"}
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept={type === "emoticon" ? "image/*" : "audio/*"}
        style={{ display: "none" }}
        onChange={handleUpload}
      />
    </Box>
  );
}