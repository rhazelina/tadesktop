// routes/notifications.js
const express = require('express');
const router = express.Router();
const db = require('../');  // sambung ke db cuma belom ada prepare

// Get user notifications
router.get('/:userId', async (req, res) => {
  try {
    // Dapatkan notifikasi user
    const notifications = await db.query(`
      SELECT 
        n.*,
        p.nama as sender_name,
        j.keperluan,
        j.status as appointment_status
      FROM notifications n
      LEFT JOIN pengguna p ON n.sender_id = p.id_pengguna
      LEFT JOIN janji_temu j ON n.appointment_id = j.id_janji_temu
      WHERE n.recipient_id = $1
      ORDER BY n.created_at DESC
    `, [req.params.userId]);
    
    res.json(notifications.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE notifications SET status = "read" WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;