import jwt from 'jsonwebtoken';
import { Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const sendToken = (res: Response, statusCode: number, userId: string, user: any) => {
  const token = generateToken(userId);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    // On Render, we need SameSite=None and Secure for cross-subdomain cookies
    secure: true, 
    sameSite: 'none' as const,
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    user,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { id: string };
};
