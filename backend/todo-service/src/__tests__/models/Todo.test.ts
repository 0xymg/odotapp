import { TodoModel } from '../../models/Todo';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../../types/todo';

jest.mock('../../config/database', () => ({
  query: jest.fn()
}));

import pool from '../../config/database';
const mockQuery = (pool.query as jest.Mock);

describe('TodoModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUserUuid', () => {
    it('should return todos for user', async () => {
      const mockTodos: Todo[] = [
        {
          id: 1,
          uuid: 'todo-uuid-1',
          content: 'Test todo 1',
          user_uuid: 'user-uuid-123',
          completed: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockQuery.mockResolvedValue({
        rows: mockTodos
      });

      const result = await TodoModel.findByUserUuid('user-uuid-123');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM todos WHERE user_uuid = $1 ORDER BY created_at DESC',
        ['user-uuid-123']
      );
      expect(result).toEqual(mockTodos);
    });

    it('should return empty array when no todos', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      const result = await TodoModel.findByUserUuid('user-uuid-123');

      expect(result).toEqual([]);
    });
  });

  describe('findByUuid', () => {
    it('should return todo when found', async () => {
      const mockTodo: Todo = {
        id: 1,
        uuid: 'todo-uuid-1',
        content: 'Test todo',
        user_uuid: 'user-uuid-123',
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockQuery.mockResolvedValue({
        rows: [mockTodo]
      });

      const result = await TodoModel.findByUuid('todo-uuid-1');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM todos WHERE uuid = $1',
        ['todo-uuid-1']
      );
      expect(result).toEqual(mockTodo);
    });

    it('should return null when todo not found', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      const result = await TodoModel.findByUuid('non-existent-uuid');

      expect(result).toBeNull();
    });
  });

  describe('findByUuidAndUser', () => {
    it('should return todo when found and belongs to user', async () => {
      const mockTodo: Todo = {
        id: 1,
        uuid: 'todo-uuid-1',
        content: 'Test todo',
        user_uuid: 'user-uuid-123',
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockQuery.mockResolvedValue({
        rows: [mockTodo]
      });

      const result = await TodoModel.findByUuidAndUser('todo-uuid-1', 'user-uuid-123');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM todos WHERE uuid = $1 AND user_uuid = $2',
        ['todo-uuid-1', 'user-uuid-123']
      );
      expect(result).toEqual(mockTodo);
    });

    it('should return null when todo does not belong to user', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      const result = await TodoModel.findByUuidAndUser('todo-uuid-1', 'different-user-uuid');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return new todo', async () => {
      const todoData: CreateTodoRequest = {
        content: 'New test todo'
      };

      const createdTodo: Todo = {
        id: 1,
        uuid: expect.any(String),
        content: 'New test todo',
        user_uuid: 'user-uuid-123',
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockQuery.mockResolvedValue({
        rows: [createdTodo]
      });

      const result = await TodoModel.create(todoData, 'user-uuid-123');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO todos'),
        [expect.any(String), 'New test todo', 'user-uuid-123', false]
      );
      expect(result).toEqual(createdTodo);
    });
  });

  describe('update', () => {
    it('should update todo content', async () => {
      const updateData: UpdateTodoRequest = {
        content: 'Updated content'
      };

      const updatedTodo: Todo = {
        id: 1,
        uuid: 'todo-uuid-1',
        content: 'Updated content',
        user_uuid: 'user-uuid-123',
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockQuery.mockResolvedValue({
        rows: [updatedTodo]
      });

      const result = await TodoModel.update('todo-uuid-1', 'user-uuid-123', updateData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE todos'),
        ['Updated content', 'todo-uuid-1', 'user-uuid-123']
      );
      expect(result).toEqual(updatedTodo);
    });

    it('should update todo completion status', async () => {
      const updateData: UpdateTodoRequest = {
        completed: true
      };

      const updatedTodo: Todo = {
        id: 1,
        uuid: 'todo-uuid-1',
        content: 'Test todo',
        user_uuid: 'user-uuid-123',
        completed: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockQuery.mockResolvedValue({
        rows: [updatedTodo]
      });

      const result = await TodoModel.update('todo-uuid-1', 'user-uuid-123', updateData);

      expect(result).toEqual(updatedTodo);
    });

    it('should return null when no fields to update', async () => {
      const result = await TodoModel.update('todo-uuid-1', 'user-uuid-123', {});

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete todo successfully', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 1
      });

      const result = await TodoModel.delete('todo-uuid-1', 'user-uuid-123');

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM todos WHERE uuid = $1 AND user_uuid = $2',
        ['todo-uuid-1', 'user-uuid-123']
      );
      expect(result).toBe(true);
    });

    it('should return false when todo not found', async () => {
      mockQuery.mockResolvedValue({
        rowCount: 0
      });

      const result = await TodoModel.delete('non-existent-uuid', 'user-uuid-123');

      expect(result).toBe(false);
    });
  });

  describe('count', () => {
    it('should return count of user todos', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ count: '5' }]
      });

      const result = await TodoModel.count('user-uuid-123');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT COUNT(*) as count FROM todos WHERE user_uuid = $1',
        ['user-uuid-123']
      );
      expect(result).toBe(5);
    });
  });

  describe('countCompleted', () => {
    it('should return count of completed todos', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ count: '3' }]
      });

      const result = await TodoModel.countCompleted('user-uuid-123');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT COUNT(*) as count FROM todos WHERE user_uuid = $1 AND completed = true',
        ['user-uuid-123']
      );
      expect(result).toBe(3);
    });
  });
});