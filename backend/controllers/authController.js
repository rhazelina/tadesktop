import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { JWT_SECRET, TOKEN_EXPIRY } from '../config/env.js';

const login = async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  const usernameError = !username ? 'Username dibutuhkan' :
    username.length < 3 ? 'Username minimal 3 karakter' :
    username.length > 20 ? 'Username maksimal 20 karakter' : null;
  
  const passwordError = !password ? 'Password dibutuhkan' :
    password.length < 6 ? 'Password minimal 6 karakter' :
    password.length > 50 ? 'Password maksimal 50 karakter' : null;
  
  if (usernameError || passwordError) { 
    return res.status(400).json({ 
      success: false,
      message: usernameError || passwordError 
    });
  }

  try {
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
};

export { login };