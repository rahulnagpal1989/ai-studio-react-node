import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function signup(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email/password required' });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'user exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed } });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email/password required' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'invalid credentials' });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
}
