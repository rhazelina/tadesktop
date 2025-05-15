import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { JWT_SECRET } from '../config/env.js';

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

export { authenticateToken };