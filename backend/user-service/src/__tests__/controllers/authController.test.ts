import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthController } from '../../controllers/authController';
import { UserModel } from '../../models/User';
import { User } from '../../types/user';

jest.mock('../../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnThis();
    
    mockRequest = {};
    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        user_email: 'test@example.com',
        user_pwd: 'password123'
      };

      mockRequest.body = userData;

      const mockUser: User = {
        id: 1,
        uuid: 'test-uuid',
        user_email: 'test@example.com',
        user_pwd: 'hashed-password'
      };

      mockUserModel.emailExists.mockResolvedValue(false);
      mockBcrypt.hash.mockResolvedValue('hashed-password' as never);
      mockUserModel.create.mockResolvedValue(mockUser);

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockUserModel.emailExists).toHaveBeenCalledWith('test@example.com');
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        user_email: 'test@example.com',
        user_pwd: 'hashed-password'
      });
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: {
          id: 1,
          uuid: 'test-uuid',
          user_email: 'test@example.com'
        }
      });
    });

    it('should return 400 for missing email', async () => {
      mockRequest.body = { user_pwd: 'password123' };

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Email and password are required'
      });
    });

    it('should return 400 for password too short', async () => {
      mockRequest.body = {
        user_email: 'test@example.com',
        user_pwd: '123'
      };

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Password must be at least 6 characters long'
      });
    });

    it('should return 409 for existing email', async () => {
      mockRequest.body = {
        user_email: 'test@example.com',
        user_pwd: 'password123'
      };

      mockUserModel.emailExists.mockResolvedValue(true);

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(409);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Email is already registered'
      });
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        user_email: 'test@example.com',
        user_pwd: 'password123'
      };

      mockRequest.body = loginData;

      const mockUser: User = {
        id: 1,
        uuid: 'test-uuid',
        user_email: 'test@example.com',
        user_pwd: 'hashed-password'
      };

      mockUserModel.findByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwt.sign.mockReturnValue('mock-token' as never);

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockUserModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { uuid: 'test-uuid', user_email: 'test@example.com' },
        expect.any(String),
        { expiresIn: '24h' }
      );
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        token: 'mock-token',
        user: {
          uuid: 'test-uuid',
          user_email: 'test@example.com'
        }
      });
    });

    it('should return 401 for invalid email', async () => {
      mockRequest.body = {
        user_email: 'nonexistent@example.com',
        user_pwd: 'password123'
      };

      mockUserModel.findByEmail.mockResolvedValue(null);

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Invalid credentials'
      });
    });

    it('should return 401 for invalid password', async () => {
      mockRequest.body = {
        user_email: 'test@example.com',
        user_pwd: 'wrongpassword'
      };

      const mockUser: User = {
        id: 1,
        uuid: 'test-uuid',
        user_email: 'test@example.com',
        user_pwd: 'hashed-password'
      };

      mockUserModel.findByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Invalid credentials'
      });
    });
  });
});