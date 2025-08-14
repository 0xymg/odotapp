import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth';

jest.mock('jsonwebtoken');

const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('Auth Middleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnThis();
    mockNext = jest.fn();
    
    mockRequest = {
      headers: {}
    };
    
    mockResponse = {
      json: responseJson,
      status: responseStatus
    };

    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token successfully', () => {
      const mockPayload = {
        uuid: 'user-uuid-123',
        user_email: 'test@example.com',
        iat: 1234567890,
        exp: 1234567890
      };

      mockRequest.headers = {
        authorization: 'Bearer valid-jwt-token'
      };

      mockJwt.verify.mockReturnValue(mockPayload as any);

      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockJwt.verify).toHaveBeenCalledWith(
        'valid-jwt-token',
        'super-secret-jwt-key-for-development-only'
      );
      expect(mockRequest.user).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 when no authorization header', () => {
      mockRequest.headers = {};

      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Access token required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when no token in authorization header', () => {
      mockRequest.headers = {
        authorization: 'Bearer'
      };

      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Access token required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is malformed (Basic auth)', () => {
      mockRequest.headers = {
        authorization: 'Basic some-credentials'
      };

      const invalidError = new jwt.JsonWebTokenError('Invalid token');
      mockJwt.verify.mockImplementation(() => {
        throw invalidError;
      });

      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Invalid token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is expired', () => {
      mockRequest.headers = {
        authorization: 'Bearer expired-token'
      };

      const expiredError = new jwt.TokenExpiredError('Token expired', new Date());
      mockJwt.verify.mockImplementation(() => {
        throw expiredError;
      });

      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Token expired'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token'
      };

      const invalidError = new jwt.JsonWebTokenError('Invalid token');
      mockJwt.verify.mockImplementation(() => {
        throw invalidError;
      });

      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Invalid token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for general JWT verification error', () => {
      mockRequest.headers = {
        authorization: 'Bearer malformed-token'
      };

      const generalError = new Error('General JWT error');
      mockJwt.verify.mockImplementation(() => {
        throw generalError;
      });

      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Token validation failed'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});