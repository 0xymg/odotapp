import { UserModel } from '../../models/User';
import { User, CreateUserRequest } from '../../types/user';

jest.mock('../../config/database', () => ({
  query: jest.fn()
}));

import pool from '../../config/database';
const mockQuery = (pool.query as jest.Mock);

describe('UserModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const mockUser: User = {
        id: 1,
        uuid: 'test-uuid',
        user_email: 'test@example.com',
        user_pwd: 'hashed-password'
      };

      mockQuery.mockResolvedValue({
        rows: [mockUser]
      });

      const result = await UserModel.findByEmail('test@example.com');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE user_email = $1',
        ['test@example.com']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      const result = await UserModel.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findByUuid', () => {
    it('should return user when found', async () => {
      const mockUser: User = {
        id: 1,
        uuid: 'test-uuid',
        user_email: 'test@example.com',
        user_pwd: 'hashed-password'
      };

      mockQuery.mockResolvedValue({
        rows: [mockUser]
      });

      const result = await UserModel.findByUuid('test-uuid');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE uuid = $1',
        ['test-uuid']
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create and return new user', async () => {
      const userData: CreateUserRequest = {
        user_email: 'test@example.com',
        user_pwd: 'hashed-password'
      };

      const createdUser: User = {
        id: 1,
        uuid: expect.any(String),
        user_email: 'test@example.com',
        user_pwd: 'hashed-password'
      };

      mockQuery.mockResolvedValue({
        rows: [createdUser]
      });

      const result = await UserModel.create(userData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [expect.any(String), 'test@example.com', 'hashed-password']
      );
      expect(result).toEqual(createdUser);
    });
  });

  describe('emailExists', () => {
    it('should return true when email exists', async () => {
      const mockUser: User = {
        id: 1,
        uuid: 'test-uuid',
        user_email: 'test@example.com',
        user_pwd: 'hashed-password'
      };

      mockQuery.mockResolvedValue({
        rows: [mockUser]
      });

      const result = await UserModel.emailExists('test@example.com');

      expect(result).toBe(true);
    });

    it('should return false when email does not exist', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      const result = await UserModel.emailExists('nonexistent@example.com');

      expect(result).toBe(false);
    });
  });
});