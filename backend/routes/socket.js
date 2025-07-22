const User = require('./models/User');
const Room = require('./models/Room');

function setupSocket(io) {
  const userSockets = {}; // username -> socket.id
  const roomUsers = {};   // roomId -> [user objects]

  io.on('connection', (socket) => {
    // Join Room
    socket.on('joinRoom', async (data) => {
      socket.join(data.roomId);
      userSockets[data.username] = socket.id;
      if (!roomUsers[data.roomId]) roomUsers[data.roomId] = [];
      // Evita duplicati
      roomUsers[data.roomId] = roomUsers[data.roomId].filter(u => u.username !== data.username);
      roomUsers[data.roomId].push({ ...data, socketId: socket.id });
      // Aggiorna userlist per tutti
      io.to(data.roomId).emit('updateUserList', roomUsers[data.roomId]);
    });

    // Leave Room
    socket.on('leaveRoom', (data) => {
      socket.leave(data.roomId);
      if (roomUsers[data.roomId]) {
        roomUsers[data.roomId] = roomUsers[data.roomId].filter(u => u.username !== data.username);
        io.to(data.roomId).emit('updateUserList', roomUsers[data.roomId]);
      }
      delete userSockets[data.username];
    });

    // Messaggio pubblico
    socket.on('sendMessage', (msg) => {
      io.to(msg.roomId).emit('receiveMessage', msg);
    });

    // Annuncio (solo staff/founder)
    socket.on('sendAnnouncement', (data) => {
      io.to(data.roomId).emit('receiveAnnouncement', { text: data.text });
    });

    // Kick user (solo staff/founder)
    socket.on('kickUser', (data) => {
      // Proteggi founder!
      Room.findOne({ _id: data.roomId }).then(room => {
        const user = roomUsers[data.roomId]?.find(u => u.username === data.username);
        if (user && user.role !== 'founder') {
          io.to(user.socketId).emit('receiveAnnouncement', { text: "Sei stato espulso dalla stanza!" });
          io.sockets.sockets.get(user.socketId)?.leave(data.roomId);
          roomUsers[data.roomId] = roomUsers[data.roomId].filter(u => u.username !== data.username);
          io.to(data.roomId).emit('updateUserList', roomUsers[data.roomId]);
        }
      });
    });

    // Ban user (solo staff/founder)
    socket.on('banUser', (data) => {
      // Proteggi founder!
      Room.findOne({ _id: data.roomId }).then(room => {
        const user = roomUsers[data.roomId]?.find(u => u.username === data.username);
        if (user && user.role !== 'founder') {
          io.to(user.socketId).emit('receiveAnnouncement', { text: "Sei stato bannato!" });
          io.sockets.sockets.get(user.socketId)?.leave(data.roomId);
          roomUsers[data.roomId] = roomUsers[data.roomId].filter(u => u.username !== data.username);
          io.to(data.roomId).emit('updateUserList', roomUsers[data.roomId]);
          // Aggiorna DB per ban (aggiungi logica qui se vuoi persistenza)
        }
      });
    });

    // Messaggi privati
    socket.on('sendPrivateMessage', (msg) => {
      const toSocket = io.sockets.sockets.get(msg.to);
      if (toSocket) {
        toSocket.emit('receivePrivateMessage', msg);
      }
      // Echo anche al mittente
      socket.emit('receivePrivateMessage', msg);
    });

    // Richiesta cam
    socket.on('requestCamView', ({ from, to }) => {
      const toSocket = io.sockets.sockets.get(to);
      if (toSocket) {
        toSocket.emit('camRequest', { fromUser: from });
      }
    });

    // Upload Emoticon
    socket.on('uploadEmoticon', ({ roomId, url }) => {
      io.to(roomId).emit('receiveMessage', {
        username: 'Emoticon',
        text: `<img src="${url}" style="max-height:40px" />`,
        createdAt: new Date(),
        colors: "#fff"
      });
    });

    // Upload Audio
    socket.on('uploadAudio', ({ roomId, url }) => {
      io.to(roomId).emit('receiveMessage', {
        username: 'Audio',
        text: `<audio controls src="${url}" style="max-width:100px"></audio>`,
        createdAt: new Date(),
        colors: "#fff"
      });
    });

    // Gestione disconnessione
    socket.on('disconnect', () => {
      // Rimuovi da tutte le room
      Object.keys(roomUsers).forEach(roomId => {
        roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
        io.to(roomId).emit('updateUserList', roomUsers[roomId]);
      });
      const username = Object.keys(userSockets).find(u => userSockets[u] === socket.id);
      if (username) delete userSockets[username];
    });
  });
}

module.exports = { setupSocket };