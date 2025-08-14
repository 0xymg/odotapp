export interface Todo {
  id: number;
  uuid: string;
  content: string;
  user_uuid: string;
  completed: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateTodoRequest {
  content: string;
}

export interface UpdateTodoRequest {
  content?: string;
  completed?: boolean;
}

export interface TodoResponse {
  uuid: string;
  content: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  uuid: string;
  user_email: string;
  iat?: number;
  exp?: number;
}