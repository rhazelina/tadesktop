import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

// Config
import { pool } from './config/database.js';
import { JWT_SECRET } from './config/env.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import qrRoutes from './routes/qrRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Services
import { initializeWebSocket } from './services/websocketService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket
initializeWebSocket(server);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

// Database initialization
import { initializeDatabase } from './models/initModels.js';
initializeDatabase(pool);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Start server
server.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});