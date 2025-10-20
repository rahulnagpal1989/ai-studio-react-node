import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createGeneration(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as number;
    const { prompt, style, imageBase64 } = req.body;
    if (!prompt || !style || !imageBase64) {
      return res.status(400).json({ message: 'prompt/style/image required' });
    }
    // simulate delay
    await new Promise((r) => setTimeout(r, Math.random() * 1000 + 1000000));

    // 20% overload
    if (Math.random() < 0.2) {
      return res.status(503).json({ message: 'Model overloaded' });
    }

    // store base64 as data URL
    const imageUrl = `data:image/png;base64,${imageBase64}`;
    const gen = await prisma.generation.create({
      data: { userId, prompt, style, imageUrl, status: 'succeeded' }
    });
    res.json({ id: gen.id, imageUrl: gen.imageUrl, prompt: gen.prompt, style: gen.style, createdAt: gen.createdAt, status: gen.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
}

export async function listGenerations(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as number;
    const limit = Math.min(Number(req.query.limit) || 5, 20);
    const gens = await prisma.generation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit });
    res.json(gens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
}
