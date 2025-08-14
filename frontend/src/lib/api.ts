import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoStats } from '@/types/todo';

const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3001';
const TODO_SERVICE_URL = process.env.NEXT_PUBLIC_TODO_SERVICE_URL || 'http://localhost:3002';

// Create API instances
const userApi = axios.create({
  baseURL: USER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const todoApi = axios.create({
  baseURL: TODO_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to todo API requests
todoApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add token to user API requests
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await userApi.post('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await userApi.post('/api/auth/register', data);
    return response.data;
  },
};

// Todo API
export const todosApi = {
  getTodos: async (): Promise<{ todos: Todo[]; total: number }> => {
    const response = await todoApi.get('/api/todos');
    return response.data;
  },

  createTodo: async (data: CreateTodoRequest): Promise<{ message: string; todo: Todo }> => {
    const response = await todoApi.post('/api/todos', data);
    return response.data;
  },

  updateTodo: async (id: string, data: UpdateTodoRequest): Promise<{ message: string; todo: Todo }> => {
    const response = await todoApi.put(`/api/todos/${id}`, data);
    return response.data;
  },

  deleteTodo: async (id: string): Promise<void> => {
    await todoApi.delete(`/api/todos/${id}`);
  },

  getStats: async (): Promise<{ stats: TodoStats }> => {
    const response = await todoApi.get('/api/todos/stats');
    return response.data;
  },
};

// Admin API
export const adminApi = {
  getAllUsers: async (): Promise<{ users: User[]; message: string }> => {
    const response = await userApi.get('/api/admin/users');
    return response.data;
  },

  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const response = await userApi.delete(`/api/admin/users/${userId}`);
    return response.data;
  },

  updateUserRole: async (userId: string, role: string): Promise<{ message: string; user: User }> => {
    const response = await userApi.put(`/api/admin/users/${userId}/role`, { role });
    return response.data;
  },
};