import { Response } from 'express';
import { TodoController } from '../../controllers/todoController';
import { TodoModel } from '../../models/Todo';
import { AuthenticatedRequest } from '../../middleware/auth';
import { Todo } from '../../types/todo';

jest.mock('../../models/Todo');

const mockTodoModel = TodoModel as jest.Mocked<typeof TodoModel>;

describe('TodoController', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnThis();
    
    mockRequest = {
      user: {
        uuid: 'user-uuid-123',
        user_email: 'test@example.com'
      }
    };
    
    mockResponse = {
      json: responseJson,
      status: responseStatus,
      send: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('getTodos', () => {
    it('should get user todos successfully', async () => {
      const mockTodos: Todo[] = [
        {
          id: 1,
          uuid: 'todo-uuid-1',
          content: 'Test todo 1',
          user_uuid: 'user-uuid-123',
          completed: false,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          uuid: 'todo-uuid-2',
          content: 'Test todo 2',
          user_uuid: 'user-uuid-123',
          completed: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockTodoModel.findByUserUuid.mockResolvedValue(mockTodos);

      await TodoController.getTodos(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockTodoModel.findByUserUuid).toHaveBeenCalledWith('user-uuid-123');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        todos: expect.arrayContaining([
          expect.objectContaining({
            uuid: 'todo-uuid-1',
            content: 'Test todo 1',
            completed: false
          }),
          expect.objectContaining({
            uuid: 'todo-uuid-2',
            content: 'Test todo 2',
            completed: true
          })
        ]),
        total: 2
      });
    });

    it('should return empty array when no todos', async () => {
      mockTodoModel.findByUserUuid.mockResolvedValue([]);

      await TodoController.getTodos(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        todos: [],
        total: 0
      });
    });
  });

  describe('createTodo', () => {
    it('should create todo successfully', async () => {
      const requestBody = { content: 'New test todo' };
      mockRequest.body = requestBody;

      const mockCreatedTodo: Todo = {
        id: 1,
        uuid: 'new-todo-uuid',
        content: 'New test todo',
        user_uuid: 'user-uuid-123',
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockTodoModel.create.mockResolvedValue(mockCreatedTodo);

      await TodoController.createTodo(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockTodoModel.create).toHaveBeenCalledWith(
        { content: 'New test todo' },
        'user-uuid-123'
      );
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Todo created successfully',
        todo: expect.objectContaining({
          uuid: 'new-todo-uuid',
          content: 'New test todo',
          completed: false
        })
      });
    });

    it('should return 400 for empty content', async () => {
      mockRequest.body = { content: '' };

      await TodoController.createTodo(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Todo content is required'
      });
    });

    it('should return 400 for content too long', async () => {
      mockRequest.body = { content: 'x'.repeat(501) };

      await TodoController.createTodo(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Todo content must be less than 500 characters'
      });
    });
  });

  describe('updateTodo', () => {
    it('should update todo successfully', async () => {
      mockRequest.params = { id: 'todo-uuid-1' };
      mockRequest.body = { completed: true };

      const existingTodo: Todo = {
        id: 1,
        uuid: 'todo-uuid-1',
        content: 'Test todo',
        user_uuid: 'user-uuid-123',
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      const updatedTodo: Todo = {
        ...existingTodo,
        completed: true,
        updated_at: new Date()
      };

      mockTodoModel.findByUuidAndUser.mockResolvedValue(existingTodo);
      mockTodoModel.update.mockResolvedValue(updatedTodo);

      await TodoController.updateTodo(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockTodoModel.findByUuidAndUser).toHaveBeenCalledWith('todo-uuid-1', 'user-uuid-123');
      expect(mockTodoModel.update).toHaveBeenCalledWith('todo-uuid-1', 'user-uuid-123', { completed: true });
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Todo updated successfully',
        todo: expect.objectContaining({
          uuid: 'todo-uuid-1',
          completed: true
        })
      });
    });

    it('should return 404 for non-existent todo', async () => {
      mockRequest.params = { id: 'non-existent-uuid' };
      mockRequest.body = { completed: true };

      mockTodoModel.findByUuidAndUser.mockResolvedValue(null);

      await TodoController.updateTodo(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Todo not found or does not belong to user'
      });
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo successfully', async () => {
      mockRequest.params = { id: 'todo-uuid-1' };

      const existingTodo: Todo = {
        id: 1,
        uuid: 'todo-uuid-1',
        content: 'Test todo',
        user_uuid: 'user-uuid-123',
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockTodoModel.findByUuidAndUser.mockResolvedValue(existingTodo);
      mockTodoModel.delete.mockResolvedValue(true);

      await TodoController.deleteTodo(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockTodoModel.findByUuidAndUser).toHaveBeenCalledWith('todo-uuid-1', 'user-uuid-123');
      expect(mockTodoModel.delete).toHaveBeenCalledWith('todo-uuid-1', 'user-uuid-123');
      expect(responseStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 for non-existent todo', async () => {
      mockRequest.params = { id: 'non-existent-uuid' };

      mockTodoModel.findByUuidAndUser.mockResolvedValue(null);

      await TodoController.deleteTodo(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Todo not found or does not belong to user'
      });
    });
  });

  describe('getStats', () => {
    it('should return statistics successfully', async () => {
      mockTodoModel.count.mockResolvedValue(5);
      mockTodoModel.countCompleted.mockResolvedValue(3);

      await TodoController.getStats(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockTodoModel.count).toHaveBeenCalledWith('user-uuid-123');
      expect(mockTodoModel.countCompleted).toHaveBeenCalledWith('user-uuid-123');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        stats: {
          total: 5,
          completed: 3,
          pending: 2,
          completion_rate: 60
        }
      });
    });

    it('should handle zero todos', async () => {
      mockTodoModel.count.mockResolvedValue(0);
      mockTodoModel.countCompleted.mockResolvedValue(0);

      await TodoController.getStats(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(responseJson).toHaveBeenCalledWith({
        stats: {
          total: 0,
          completed: 0,
          pending: 0,
          completion_rate: 0
        }
      });
    });
  });
});