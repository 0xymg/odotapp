import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { CreateUserRequest, LoginRequest, LoginResponse, JWTPayload } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 12;

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { user_email, user_pwd }: CreateUserRequest = req.body;

      if (!user_email || !user_pwd) {
        res.status(400).json({ 
          error: 'Email and password are required' 
        });
        return;
      }

      if (user_pwd.length < 6) {
        res.status(400).json({ 
          error: 'Password must be at least 6 characters long' 
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user_email)) {
        res.status(400).json({ 
          error: 'Invalid email format' 
        });
        return;
      }

      const userExists = await UserModel.emailExists(user_email);
      if (userExists) {
        res.status(409).json({ 
          error: 'Email is already registered' 
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(user_pwd, SALT_ROUNDS);

      const newUser = await UserModel.create({
        user_email,
        user_pwd: hashedPassword
      });

      const { user_pwd: _, ...userResponse } = newUser;

      res.status(201).json({
        message: 'User registered successfully',
        user: userResponse
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { user_email, user_pwd }: LoginRequest = req.body;

      if (!user_email || !user_pwd) {
        res.status(400).json({ 
          error: 'Email and password are required' 
        });
        return;
      }

      const user = await UserModel.findByEmail(user_email);
      if (!user) {
        res.status(401).json({ 
          error: 'Invalid credentials' 
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(user_pwd, user.user_pwd);
      if (!isPasswordValid) {
        res.status(401).json({ 
          error: 'Invalid credentials' 
        });
        return;
      }

      const tokenPayload: JWTPayload = {
        uuid: user.uuid,
        user_email: user.user_email,
        role: user.role
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { 
        expiresIn: '24h' 
      });

      const response: LoginResponse = {
        token,
        user: {
          uuid: user.uuid,
          user_email: user.user_email,
          role: user.role
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }
}