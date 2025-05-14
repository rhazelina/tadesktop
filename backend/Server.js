require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'appointment_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create appointments table if not exists
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
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

// API Endpoints
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

// Get all appointments (optional - for testing)
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});