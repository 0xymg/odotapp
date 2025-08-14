import { Response } from 'express';
import { TodoModel } from '../models/Todo';
import { CreateTodoRequest, UpdateTodoRequest, TodoResponse } from '../types/todo';
import { AuthenticatedRequest } from '../middleware/auth';

export class TodoController {
  static async getTodos(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userUuid = req.user!.uuid;
      const todos = await TodoModel.findByUserUuid(userUuid);
      
      const todoResponses: TodoResponse[] = todos.map(todo => ({
        uuid: todo.uuid,
        content: todo.content,
        completed: todo.completed,
        created_at: todo.created_at!,
        updated_at: todo.updated_at!
      }));

      res.status(200).json({
        todos: todoResponses,
        total: todoResponses.length
      });
    } catch (error) {
      console.error('Get todos error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createTodo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { content }: CreateTodoRequest = req.body;
      const userUuid = req.user!.uuid;

      if (!content || content.trim().length === 0) {
        res.status(400).json({ error: 'Todo content is required' });
        return;
      }

      if (content.length > 500) {
        res.status(400).json({ error: 'Todo content must be less than 500 characters' });
        return;
      }

      const newTodo = await TodoModel.create({ content: content.trim() }, userUuid);
      
      const todoResponse: TodoResponse = {
        uuid: newTodo.uuid,
        content: newTodo.content,
        completed: newTodo.completed,
        created_at: newTodo.created_at!,
        updated_at: newTodo.updated_at!
      };

      res.status(201).json({
        message: 'Todo created successfully',
        todo: todoResponse
      });
    } catch (error) {
      console.error('Create todo error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateTodo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateTodoRequest = req.body;
      const userUuid = req.user!.uuid;

      if (!id) {
        res.status(400).json({ error: 'Todo ID is required' });
        return;
      }

      // Validate update data
      if (updateData.content !== undefined) {
        if (typeof updateData.content !== 'string' || updateData.content.trim().length === 0) {
          res.status(400).json({ error: 'Todo content must be a non-empty string' });
          return;
        }
        if (updateData.content.length > 500) {
          res.status(400).json({ error: 'Todo content must be less than 500 characters' });
          return;
        }
        updateData.content = updateData.content.trim();
      }

      if (updateData.completed !== undefined && typeof updateData.completed !== 'boolean') {
        res.status(400).json({ error: 'Completed status must be a boolean' });
        return;
      }

      // Check if the todo exists and belongs to the user
      const existingTodo = await TodoModel.findByUuidAndUser(id, userUuid);
      if (!existingTodo) {
        res.status(404).json({ error: 'Todo not found or does not belong to user' });
        return;
      }

      const updatedTodo = await TodoModel.update(id, userUuid, updateData);
      
      if (!updatedTodo) {
        res.status(400).json({ error: 'No valid fields provided for update' });
        return;
      }

      const todoResponse: TodoResponse = {
        uuid: updatedTodo.uuid,
        content: updatedTodo.content,
        completed: updatedTodo.completed,
        created_at: updatedTodo.created_at!,
        updated_at: updatedTodo.updated_at!
      };

      res.status(200).json({
        message: 'Todo updated successfully',
        todo: todoResponse
      });
    } catch (error) {
      console.error('Update todo error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteTodo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userUuid = req.user!.uuid;

      if (!id) {
        res.status(400).json({ error: 'Todo ID is required' });
        return;
      }

      // Check if the todo exists and belongs to the user
      const existingTodo = await TodoModel.findByUuidAndUser(id, userUuid);
      if (!existingTodo) {
        res.status(404).json({ error: 'Todo not found or does not belong to user' });
        return;
      }

      const deleted = await TodoModel.delete(id, userUuid);
      
      if (!deleted) {
        res.status(404).json({ error: 'Todo not found or could not be deleted' });
        return;
      }

      res.status(204).send(); // No Content
    } catch (error) {
      console.error('Delete todo error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userUuid = req.user!.uuid;
      
      const total = await TodoModel.count(userUuid);
      const completed = await TodoModel.countCompleted(userUuid);
      const pending = total - completed;

      res.status(200).json({
        stats: {
          total,
          completed,
          pending,
          completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0
        }
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}