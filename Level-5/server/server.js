// server.js - Node.js WebSocket Signaling Server
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const rooms = {}; // roomId => array of clients

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.error('Invalid JSON', e);
      return;
    }

    if (data.join) {
      ws.roomId = data.join;
      if (!rooms[ws.roomId]) rooms[ws.roomId] = [];
      rooms[ws.roomId].push(ws);
      console.log(`Client joined room: ${ws.roomId}`);
      return;
    }

    if (ws.roomId && data.signal) {
      // Broadcast signaling data to others in the room
      rooms[ws.roomId].forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data.signal));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (ws.roomId && rooms[ws.roomId]) {
      rooms[ws.roomId] = rooms[ws.roomId].filter(c => c !== ws);
      if (rooms[ws.roomId].length === 0) {
        delete rooms[ws.roomId];
      }
    }
  });
});

console.log('Signaling server running on ws://localhost:8080');
