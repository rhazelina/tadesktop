import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//  WebSocket Server
const server = app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

//  JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || '';
const TOKEN_EXPIRY = '1h';

// Middleware 
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

// Database configuration 
const pool = new pg.Pool({
  user: process.env.DB_USER || 'haries',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'testingdb',
  password: process.env.DB_PASSWORD || 'abcd1',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

//  Middleware Autentikasi JWT
const authenticateToken = (roles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);

    try {
      const user = jwt.verify(token, JWT_SECRET);
      const userCheck = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [user.id]
      );
      
      if (!userCheck.rows[0] || !roles.includes(userCheck.rows[0].role)) {
        return res.sendStatus(403);
      }
      
      req.user = userCheck.rows[0];
      next();
    } catch (err) {
      console.error('JWT Error:', err);
      res.sendStatus(403);
    }
  };
};

//  WebSocket Authentication
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

// Service QR Code
app.post('/api/qr/generate', authenticateToken(['admin', 'operator']), async (req, res) => {
  try {
    const { purpose } = req.body;
    const qrId = uuidv4();
    const qrData = JSON.stringify({
      id: qrId,
      purpose,
      timestamp: new Date().toISOString()
    });

    // Generate QR Code Image
    const qrImage = await QRCode.toDataURL(qrData);
    
    // Simpan ke database
    await pool.query(
      `INSERT INTO qr_codes 
      (id, qr_data, created_by, expires_at)
      VALUES ($1, $2, $3, NOW() + INTERVAL '1 hour')`,
      [qrId, qrData, req.user.id]
    );

    // Kirim notifikasi via WebSocket
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'QR_GENERATED',
          data: { qrId, purpose }
        }));
      }
    });

    res.json({ qrId, qrImage });
  } catch (err) {
    console.error('QR Generation Error:', err);
    res.status(500).send('Gagal membuat QR Code');
  }
});

app.post('/api/qr/verify', authenticateToken(['operator']), async (req, res) => {
  const { qrId } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE qr_codes 
       SET status = 'used', used_at = NOW()
       WHERE id = $1 AND status = 'active'
       RETURNING *`,
      [qrId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ valid: false });
    }

    res.json({ valid: true, data: result.rows[0] });
  } catch (err) {
    console.error('QR Verification Error:', err);
    res.status(500).send('Gagal memverifikasi QR');
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);
  
  if (usernameError || passwordError) {
    return res.status(400).json({ 
      success: false,
      message: usernameError || passwordError 
    });
  }

  try {
    // Case-insensitive username check
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(username) = LOWER($1)',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Username atau password salah' 
      });
    }

    const user = result.rows[0];
    
    // Debug logging (remove in production)
    console.log(`Comparing password for ${username}:`, {
      inputPassword: password,
      storedHash: user.password
    });

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Username atau password salah' 
      });
    }

    res.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat login' 
    });
  }
});
  
  // Aftrt verifikasi password
  const tokenPayload = {
    id: user.id,
    username: user.username,
    role: user.role
  };
  
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

  res.json({
    success: true,
    message: 'Login berhasil',
    token, 
    user: tokenPayload
  });
// });

// Endpoint Protected
app.get('/api/dashboard', authenticateToken(['admin']), async (req, res) => {
  try {
    const dashboardData = await pool.query(
      `SELECT * FROM some_secure_data
       WHERE admin_id = $1`,
      [req.user.id]
    );
    
    res.json(dashboardData.rows);
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).send('Akses dashboard gagal');
  }
});
