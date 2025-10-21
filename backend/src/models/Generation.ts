import { db } from './database';

export interface Generation {
  id: number;
  userId: number;
  prompt: string;
  style: string;
  imageUrl: string;
  status: string;
  createdAt: string;
}

export async function createGeneration(
  userId: number,
  prompt: string,
  style: string,
  imageUrl: string,
  status: string
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO Generation (userId, prompt, style, imageUrl, status) VALUES (?, ?, ?, ?, ?)',
      [userId, prompt, style, imageUrl, status],
      function (err: any) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });
}

export async function getGenerationsByUserId(
  userId: number,
  limit: number = 5
): Promise<Generation[]> {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM Generation WHERE userId = ? ORDER BY createdAt DESC LIMIT ?',
      [userId, limit],
      (err: any, result: any) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}
