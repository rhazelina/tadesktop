import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// WebSocket Server
const server = app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || '';
const TOKEN_EXPIRY = '1h';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.json());

// Database configuration
const pool = mysql.createPool({ 
  host: process.env.DB_HOST || 'localhost', 
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bukutamu_final',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize Database
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    // Create appointments table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        noHp VARCHAR(20) NOT NULL,
        keterangan VARCHAR(255) NOT NULL,
        tanggal DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    

    
    connection.release();
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initializeDatabase();

// Middleware Autentikasi JWT
const authenticateToken = (roles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);

    try {
      const user = jwt.verify(token, JWT_SECRET);
      const [userCheck] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [user.id]
      );
      
      if (!userCheck[0] || !roles.includes(userCheck[0].role)) {
        return res.sendStatus(403);
      }
      
      req.user = userCheck[0];
      next();
    } catch (err) {
      console.error('JWT Error:', err);
      res.sendStatus(403);
    }
  };
};

// WebSocket Authentication
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
      VALUES (?, ?, ?, NOW() + INTERVAL 1 HOUR)`,
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
    const [updateResult] = await pool.query(
      `UPDATE qr_codes 
       SET status = 'used', used_at = NOW()
       WHERE id = ? AND status = 'active'`,
      [qrId]
    );
    
    const [result] = await pool.query(
      'SELECT * FROM qr_codes WHERE id = ?',
      [qrId]
    );
    
    if (result.length === 0) {
      return res.status(400).json({ valid: false });
    }

    res.json({ valid: true, data: result[0] });
  } catch (err) {
    console.error('QR Verification Error:', err);
    res.status(500).send('Gagal memverifikasi QR');
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  const usernameError = !username ? 'Username dibutuhkan' :
    username.length < 3 ? 'Username minimal 3 karakter' :
    username.length > 20 ? 'Username maksimal 20 karakter' :
    // !/^[a-zA-Z0-9_]+$/.test(username) ? 'Username hanya bisa huruf, angka dan underscores' : 
    null;
  const passwordError = !password ? 'Password dibutuhkan' :
    password.length < 6 ? 'Password minimal 6 karakter' :
    password.length > 50 ? 'Password maksimal 50 karakter' :
    // !/[A-Z]/.test(password) ? 'Password harus memiliki minimal 1 huruf besar' :
    // !/[a-z]/.test(password) ? 'Password harus memiliki minimal 1 kecil besar' :
    // !/[0-9]/.test(password) ? 'Password harus memiliki minimal 1 angka besar' :
    null;
  
  if (usernameError || passwordError) { 
    return res.status(400).json({ 
      success: false,
      message: usernameError || passwordError 
    });
  }

  try {
    // Case-insensitive username check
    const [result] = await pool.query(
      'SELECT * FROM users WHERE LOWER(username) = LOWER(?)',
      [username]
    );

    if (result.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Username atau password salah' 
      });
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Username atau password salah' 
      });
    }

    // Generate JWT token
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat login' 
    });
  }
});

// Appointment Endpoints
app.post('/api/appointments', async (req, res) => {
  try {
    const { nama, noHp, keterangan, tanggal } = req.body;
    
    // Basic validation
    if (!nama || !noHp || !keterangan || !tanggal) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO appointments (nama, noHp, keterangan, tanggal) VALUES (?, ?, ?, ?)',
      [nama, noHp, keterangan, tanggal]
    );
    connection.release();

    res.status(201).json({ 
      message: 'Janji temu berhasil dibuat',
      appointmentId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Gagal membuat janji temu' });
  }
});

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM appointments ORDER BY tanggal DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Gagal mengambil data janji temu' });
  }
});

// Endpoint Protected
app.get('/api/dashboard', authenticateToken(['admin']), async (req, res) => {
  try {
    const [dashboardData] = await pool.query(
      `SELECT * FROM some_secure_data
       WHERE admin_id = ?`,
      [req.user.id]
    );
    
    res.json(dashboardData);
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).send('Akses dashboard gagal');
  }
});


// import express from 'express';
// import cors from 'cors';
// // import pg from 'pg';
// import mysql from 'mysql2/promise';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import { WebSocketServer } from 'ws';
// import QRCode from 'qrcode';
// import { v4 as uuidv4 } from 'uuid';

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3001;

// //  WebSocket Server
// const server = app.listen(port, () => {
//   console.log(`Server berjalan di http://localhost:${port}`);
// });

// const wss = new WebSocketServer({ server });

// //  JWT Configuration
// const JWT_SECRET = process.env.JWT_SECRET || '';
// const TOKEN_EXPIRY = '1h';

// // Middleware 
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json({ limit: '10kb' }));

// // Database configuration 
// // const pool = new pg.Pool({
// //   user: process.env.DB_USER || 'haries',
// //   host: process.env.DB_HOST || 'localhost',
// //   database: process.env.DB_NAME || 'testingdb',
// //   password: process.env.DB_PASSWORD || 'abcd1',
// //   port: process.env.DB_PORT || 5432,
// //   max: 20,
// //   idleTimeoutMillis: 30000,
// //   connectionTimeoutMillis: 2000,
// // });

// const pool = mysql.createPool({ 
//   host: process.env.DB_HOST || 'localhost', 
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'bukutamu_final',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });


// //  Middleware Autentikasi JWT
// const authenticateToken = (roles = []) => {
//   return async (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
    
//     if (!token) return res.sendStatus(401);

//     try {
//       const user = jwt.verify(token, JWT_SECRET);
//       // const userCheck = await pool.query(
//       //   'SELECT * FROM users WHERE id = $1',
//       //   [user.id]
//       // );
//       const [userCheck] = await pool.query(
//         'SELECT * FROM users WHERE id = ?',
//         [user.id]
//       );
      
      
//       if (!userCheck.rows[0] || !roles.includes(userCheck.rows[0].role)) {
//         return res.sendStatus(403);
//       }
      
//       req.user = userCheck.rows[0];
//       next();
//     } catch (err) {
//       console.error('JWT Error:', err);
//       res.sendStatus(403);
//     }
//   };
// };

// //  WebSocket Authentication
// wss.on('connection', (ws, req) => {
//   const token = new URLSearchParams(req.url.split('?')[1]).get('token');
  
//   if (!token) {
//     ws.close();
//     return;
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       ws.close();
//       return;
//     }
    
//     ws.userId = user.id;
//     console.log(`User ${user.id} connected via WebSocket`);
//   });
// });

// // Service QR Code
// app.post('/api/qr/generate', authenticateToken(['admin', 'operator']), async (req, res) => {
//   try {
//     const { purpose } = req.body;
//     const qrId = uuidv4();
//     const qrData = JSON.stringify({
//       id: qrId,
//       purpose,
//       timestamp: new Date().toISOString()
//     });

//     // Generate QR Code Image
//     const qrImage = await QRCode.toDataURL(qrData);
    
//     // Simpan ke database
//     await pool.query(
//       `INSERT INTO qr_codes 
//       (id, qr_data, created_by, expires_at)
//       VALUES ($1, $2, $3, NOW() + INTERVAL '1 hour')`,
//       [qrId, qrData, req.user.id]
//     );

//     // Kirim notifikasi via WebSocket
//     wss.clients.forEach(client => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({
//           type: 'QR_GENERATED',
//           data: { qrId, purpose }
//         }));
//       }
//     });

//     res.json({ qrId, qrImage });
//   } catch (err) {
//     console.error('QR Generation Error:', err);
//     res.status(500).send('Gagal membuat QR Code');
//   }
// });

// app.post('/api/qr/verify', authenticateToken(['operator']), async (req, res) => {
//   const { qrId } = req.body;
  
//   try {
//     // const result = await pool.query(
//     //   `UPDATE qr_codes 
//     //    SET status = 'used', used_at = NOW()
//     //    WHERE id = $1 AND status = 'active'
//     //    RETURNING *`,
//     //   [qrId]
//     // );
//     const [updateResult] = await pool.query(
//       `UPDATE qr_codes 
//        SET status = 'used', used_at = NOW()
//        WHERE id = ? AND status = 'active'`,
//       [qrId]
//     );
    
//     // Dan ambil ulang datanya kalau butuh
//     const [result] = await pool.query(
//       'SELECT * FROM qr_codes WHERE id = ?',
//       [qrId]
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(400).json({ valid: false });
//     }

//     res.json({ valid: true, data: result.rows[0] });
//   } catch (err) {
//     console.error('QR Verification Error:', err);
//     res.status(500).send('Gagal memverifikasi QR');
//   }
// });

// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;

//   // Input validation
//   const usernameError = !username ? 'Username dibutuhkan' :
//     username.length < 3 ? 'Username minimal 3 karakter' :
//     username.length > 20 ? 'Username maksimal 20 karakter' :
//     !/^[a-zA-Z0-9_]+$/.test(username) ? 'Username hanya bisa huruf, angka dan underscores' : 
//     null;
//   const passwordError = !password ? 'Password dibutuhkan' :
//     password.length < 6 ? 'Password minimal 6 karakter' :
//     password.length > 50 ? 'Password maksimal 50 karakter' :
//     !/[A-Z]/.test(password) ? 'Password harus memiliki minimal 1 huruf besar' :
//     !/[a-z]/.test(password) ? 'Password harus memiliki minimal 1 kecil besar' :
//     !/[0-9]/.test(password) ? 'Password harus memiliki minimal 1 angka besar' :
//     null;
  
//   if (!usernameError || !passwordError) {
//     return res.status(400).json({ 
//       success: false,
//       message: usernameError || passwordError 
//     });
//   }

//   try {
//     // Case-insensitive username check
//     const result = await pool.query(
//       'SELECT * FROM users WHERE LOWER(username) = LOWER($1)',
//       [username]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ 
//         success: false,
//         message: 'Username atau password salah' 
//       });
//     }

//     const user = result.rows[0];
    
//     // Debug logging (remove in production)
//     // console.log(`Comparing password for ${username}:`, {
//     //   inputPassword: password,
//     //   storedHash: user.password
//     // });

//     const passwordMatch = await bcrypt.compare(password, user.password);
    
//     if (!passwordMatch) {
//       return res.status(401).json({ 
//         success: false,
//         message: 'Username atau password salah' 
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Login berhasil',
//       user: {
//         id: user.id,
//         username: user.username,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Terjadi kesalahan saat login' 
//     });
//   }
// });
  
//   // Aftrt verifikasi password
//   // const tokenPayload = {
//   //   id: user.id,
//   //   username: user.username,
//   //   role: user.role
//   // };
  
//   // const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

//   // res.json({
//   //   success: true,
//   //   message: 'Login berhasil',
//   //   token, 
//   //   user: tokenPayload
//   // });
// // });

// // Endpoint Protected
// app.get('/api/dashboard', authenticateToken(['admin']), async (req, res) => {
//   try {
//     const dashboardData = await pool.query(
//       `SELECT * FROM some_secure_data
//        WHERE admin_id = $1`,
//       [req.user.id]
//     );
    
//     res.json(dashboardData.rows);
//   } catch (err) {
//     console.error('Dashboard Error:', err);
//     res.status(500).send('Akses dashboard gagal');
//   }
// });
