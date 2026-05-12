// User Types - Payload definitions for API communication

export interface User {
  id: number;
  name: string;
  email: string;
  login_email: string;
  role: 'admin' | 'employee';
  status: 'active' | 'inactive';
  created_at: string;
  avatar_url?: string | null;
}

export interface UserCreatePayload {
  name: string;
  email: string;
  login_email: string;
  password: string;
  role: 'admin' | 'employee';
  status?: 'active' | 'inactive';
}

export interface UserUpdatePayload {
  id: number;
  name?: string;
  email?: string;
  login_email?: string;
  role?: 'admin' | 'employee';
  status?: 'active' | 'inactive';
}

export interface UserListResponse {
  users: User[];
  count: number;
}

export interface LoginPayload {
  login_email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface ChangePasswordPayload {
  user_id: number;
  new_password: string;
}
