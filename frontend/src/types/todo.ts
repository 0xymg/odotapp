export interface Todo {
  uuid: string;
  content: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  content: string;
}

export interface UpdateTodoRequest {
  content?: string;
  completed?: boolean;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completion_rate: number;
}