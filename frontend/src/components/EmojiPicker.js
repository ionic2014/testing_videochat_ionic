import React from "react";
import { Box } from "@mui/material";

const emojiList = ["😀","😂","😍","😜","🤩","🥳","😎","😇","😱","🥶","🥺","😭","😡","🤬","😏","👍","👎","💪","👏","🙏","🔥","💯","🎉"];

export default function EmojiPicker({ onSelect }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, bgcolor: "#23293c", p: 1, borderRadius: "10px", maxWidth: 220 }}>
      {emojiList.map(e => (
        <span style={{ fontSize: 28, cursor: "pointer" }} key={e} onClick={() => onSelect(e)}>{e}</span>
      ))}
    </Box>
  );
}