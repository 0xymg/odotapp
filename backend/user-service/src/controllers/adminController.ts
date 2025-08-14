import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { JWTPayload } from '../types/user';

interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export class AdminController {
  static async getAllUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Check if user is admin
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ 
          error: 'Access denied. Admin privileges required.' 
        });
        return;
      }

      const users = await UserModel.findAll();
      
      res.status(200).json({
        message: 'Users retrieved successfully',
        users: users
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Check if user is admin
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ 
          error: 'Access denied. Admin privileges required.' 
        });
        return;
      }

      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({ 
          error: 'User ID is required' 
        });
        return;
      }

      // Prevent admin from deleting themselves
      if (userId === req.user.uuid) {
        res.status(400).json({ 
          error: 'Cannot delete your own account' 
        });
        return;
      }

      const deleted = await UserModel.deleteByUuid(userId);
      
      if (!deleted) {
        res.status(404).json({ 
          error: 'User not found' 
        });
        return;
      }

      res.status(200).json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }

  static async updateUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Check if user is admin
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ 
          error: 'Access denied. Admin privileges required.' 
        });
        return;
      }

      const { userId } = req.params;
      const { role } = req.body;

      if (!userId || !role) {
        res.status(400).json({ 
          error: 'User ID and role are required' 
        });
        return;
      }

      if (!['user', 'admin'].includes(role)) {
        res.status(400).json({ 
          error: 'Invalid role. Must be "user" or "admin"' 
        });
        return;
      }

      // Prevent admin from changing their own role
      if (userId === req.user.uuid) {
        res.status(400).json({ 
          error: 'Cannot change your own role' 
        });
        return;
      }

      const updatedUser = await UserModel.updateRole(userId, role);
      
      if (!updatedUser) {
        res.status(404).json({ 
          error: 'User not found' 
        });
        return;
      }

      res.status(200).json({
        message: 'User role updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update role error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }
}