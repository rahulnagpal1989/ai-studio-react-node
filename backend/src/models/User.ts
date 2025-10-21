import { db } from './database';

export interface User {
  id: number;
  email: string;
  password: string;
  createdAt: string;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM User WHERE email = ?', [email], (err: any, result: any) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

export async function findUserById(id: number): Promise<User | null> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM User WHERE id = ?', [id], (err: any, result: any) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

export async function createUser(email: string, password: string): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO User (email, password) VALUES (?, ?)', [email, password], function(err: any) {
      if (err) reject(err);
      resolve(this.lastID);
    });
  });
}

export async function userExists(email: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.get('SELECT id FROM User WHERE email = ?', [email], (err: any, result: any) => {
      if (err) reject(err);
      resolve(!!result);
    });
  });
}
