// Test setup file
import { db } from '../src/models/database';

// Clean up database before each test
beforeEach(async () => {
  return new Promise((resolve) => {
    db.serialize(() => {
      db.run('DELETE FROM User', () => {
        db.run('DELETE FROM Generation', () => {
          resolve(undefined);
        });
      });
    });
  });
});

// Close database connection after all tests
afterAll(async () => {
  return new Promise((resolve) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      }
      resolve(undefined);
    });
  });
});
