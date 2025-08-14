export interface User {
  uuid: string;
  user_email: string;
  role: string;
}

export interface LoginRequest {
  user_email: string;
  user_pwd: string;
}

export interface RegisterRequest {
  user_email: string;
  user_pwd: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}