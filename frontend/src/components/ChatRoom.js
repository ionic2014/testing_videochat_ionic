import React, { useState } from "react";

export default function ChatRoom({ user, room, setRoom }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    setMessages([...messages, { user: user.username, msg }]);
    setMsg("");
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-900 p-2">
      <button className="bg-gray-700 mb-2 p-1 rounded" onClick={() => setRoom(null)}>Torna a roomlist</button>
      <h2 className="font-bold mb-2">{room.title}</h2>
      <div className="flex mb-2">
        {/* Userlist laterale demo */}
        <div className="bg-gray-800 w-64 p-2 rounded mr-2 flex flex-col">
          <div className="font-bold">Utenti</div>
          {/* ...Userlist con click su utente per menu */}
        </div>
        {/* Chatbox */}
        <div className="flex-1 flex flex-col bg-gray-800 rounded p-2">
          <div className="flex-1 overflow-y-auto mb-2">
            {messages.map((m, i) => (
              <div key={i} className="mb-1">
                <span className="font-bold">{m.user}: </span>
                <span>{m.msg}</span>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              placeholder="Messaggio..."
              className="flex-1 p-2 bg-gray-900 text-white rounded-l"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button className="bg-blue-500 p-2 rounded-r" onClick={sendMessage}>
              Invia
            </button>
          </div>
          {/* Pannellino per emoticon, immagini, audio, ecc. */}
        </div>
      </div>
    </div>
  );
}