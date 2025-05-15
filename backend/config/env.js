import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '1h';

export { JWT_SECRET, TOKEN_EXPIRY };  