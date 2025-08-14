export interface User {
  id: number;
  uuid: string;
  user_email: string;
  user_pwd: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserRequest {
  user_email: string;
  user_pwd: string;
}

export interface LoginRequest {
  user_email: string;
  user_pwd: string;
}

export interface LoginResponse {
  token: string;
  user: {
    uuid: string;
    user_email: string;
  };
}

export interface JWTPayload {
  uuid: string;
  user_email: string;
  iat?: number;
  exp?: number;
}