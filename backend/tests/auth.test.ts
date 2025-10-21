import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';

import { signup, login } from '../src/controllers/authController';
import { findUserByEmail, createUser, userExists } from '../src/models/User';

// Mock the User model functions
jest.mock('../src/models/User');
const mockedFindUserByEmail = findUserByEmail as jest.MockedFunction<
  typeof findUserByEmail
>;
const mockedCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockedUserExists = userExists as jest.MockedFunction<typeof userExists>;

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Mock jwt
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

// Create Express app for testing
const app = express();
app.use(express.json());
app.post('/signup', signup);
app.post('/login', login);

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock implementations
    mockedBcrypt.hash.mockResolvedValue('hashed_password' as never);
    mockedBcrypt.compare.mockResolvedValue(true as never);
    mockedJwt.sign.mockReturnValue('mock_jwt_token' as never);
  });

  describe('POST /signup', () => {
    it('should successfully create a new user', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockedUserExists.mockResolvedValue(false);
      mockedCreateUser.mockResolvedValue(1);

      // Act
      const response = await request(app).post('/signup').send(userData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: 'mock_jwt_token' });
      expect(mockedUserExists).toHaveBeenCalledWith('test@example.com');
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockedCreateUser).toHaveBeenCalledWith(
        'test@example.com',
        'hashed_password'
      );
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId: 1 },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: '7d' }
      );
    });

    it('should return 409 when user already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
      };
      mockedUserExists.mockResolvedValue(true);

      // Act
      const response = await request(app).post('/signup').send(userData);

      // Assert
      expect(response.status).toBe(409);
      expect(response.body).toEqual({ message: 'Email ID already exists' });
      expect(mockedUserExists).toHaveBeenCalledWith('existing@example.com');
      expect(mockedCreateUser).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid email', async () => {
      // Arrange
      const userData = {
        email: 'invalid-email',
        password: 'password123',
      };

      // Act
      const response = await request(app).post('/signup').send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.details).toContain(
        'Please provide a valid email address'
      );
      expect(mockedUserExists).not.toHaveBeenCalled();
    });

    it('should return 400 for password too short', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: '123',
      };

      // Act
      const response = await request(app).post('/signup').send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.details).toContain(
        'Password must be at least 6 characters long'
      );
      expect(mockedUserExists).not.toHaveBeenCalled();
    });

    it('should return 400 for missing email', async () => {
      // Arrange
      const userData = {
        password: 'password123',
      };

      // Act
      const response = await request(app).post('/signup').send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.details).toContain('Email is required');
    });

    it('should return 400 for missing password', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
      };

      // Act
      const response = await request(app).post('/signup').send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.details).toContain('Password is required');
    });

    it('should return 500 on server error', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockedUserExists.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app).post('/signup').send(userData);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'There is some issue please try again later' });
    });
  });

  describe('POST /login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        createdAt: '2023-01-01T00:00:00.000Z',
      };
      mockedFindUserByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Act
      const response = await request(app).post('/login').send(loginData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: 'mock_jwt_token' });
      expect(mockedFindUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashed_password'
      );
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId: 1 },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: '7d' }
      );
    });

    it('should return 401 for non-existent user', async () => {
      // Arrange
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };
      mockedFindUserByEmail.mockResolvedValue(null);

      // Act
      const response = await request(app).post('/login').send(loginData);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid Email ID or Password' });
      expect(mockedFindUserByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com'
      );
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return 401 for incorrect password', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        createdAt: '2023-01-01T00:00:00.000Z',
      };
      mockedFindUserByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act
      const response = await request(app).post('/login').send(loginData);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid Email ID or Password' });
      expect(mockedFindUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashed_password'
      );
    });

    it('should return 400 for invalid email format', async () => {
      // Arrange
      const loginData = {
        email: 'invalid-email',
        password: 'password123',
      };

      // Act
      const response = await request(app).post('/login').send(loginData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.details).toContain(
        'Please provide a valid email address'
      );
      expect(mockedFindUserByEmail).not.toHaveBeenCalled();
    });

    it('should return 400 for missing email', async () => {
      // Arrange
      const loginData = {
        password: 'password123',
      };

      // Act
      const response = await request(app).post('/login').send(loginData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.details).toContain('Email is required');
    });

    it('should return 400 for missing password', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
      };

      // Act
      const response = await request(app).post('/login').send(loginData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.details).toContain('Password is required');
    });

    it('should return 500 on server error', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockedFindUserByEmail.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app).post('/login').send(loginData);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'There is some issue please try again later' });
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate token with correct payload for signup', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockedUserExists.mockResolvedValue(false);
      mockedCreateUser.mockResolvedValue(42);

      // Act
      await request(app).post('/signup').send(userData);

      // Assert
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId: 42 },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: '7d' }
      );
    });

    it('should generate token with correct payload for login', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = {
        id: 99,
        email: 'test@example.com',
        password: 'hashed_password',
        createdAt: '2023-01-01T00:00:00.000Z',
      };
      mockedFindUserByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Act
      await request(app).post('/login').send(loginData);

      // Assert
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId: 99 },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: '7d' }
      );
    });
  });

  describe('Password Hashing', () => {
    it('should hash password with correct salt rounds', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockedUserExists.mockResolvedValue(false);
      mockedCreateUser.mockResolvedValue(1);

      // Act
      await request(app).post('/signup').send(userData);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should compare password correctly', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        createdAt: '2023-01-01T00:00:00.000Z',
      };
      mockedFindUserByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Act
      await request(app).post('/login').send(loginData);

      // Assert
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashed_password'
      );
    });
  });
});
