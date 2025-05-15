import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

let wss;

const initializeWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const token = new URLSearchParams(req.url.split('?')[1]).get('token');
    
    if (!token) {
      ws.close();
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        ws.close();
        return;
      }
      
      ws.userId = user.id;
      console.log(`User ${user.id} connected via WebSocket`);
    });
  });
};

const broadcastQRGenerated = (qrId, purpose) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'QR_GENERATED',
        data: { qrId, purpose }
      }));
    }
  });
};

export { initializeWebSocket, broadcastQRGenerated };