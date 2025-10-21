import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'no token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    // Verify user still exists in database
    const user = await findUserById(payload.userId);
    if (!user) return res.status(401).json({ message: 'user not found' });
    
    (req as any).userId = payload.userId;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'invalid token' });
  }
}
