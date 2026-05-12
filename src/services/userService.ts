// User Service - API calls for user operations

import axios from '@/lib/axios';
import {
  User,
  UserCreatePayload,
  UserUpdatePayload,
  UserListResponse,
  LoginPayload,
  LoginResponse,
  ChangePasswordPayload,
  PaginationParams,
} from '@/types';

const BASE_URL = '/users';
const AUTH_URL = '/auth';

export const userService = {
  // Get all users with optional pagination
  async getUsers(params?: PaginationParams): Promise<User[]> {
    const response = await axios.get<UserListResponse>(BASE_URL, { params });
    return response.data.users;
  },

  // Get a single user by ID
  async getUserById(id: number): Promise<User> {
    const response = await axios.get<User>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Get current logged-in user
  async getMe(): Promise<User> {
    const response = await axios.get<User>(`${AUTH_URL}/me`);
    return response.data;
  },

  // Create a new user
  async createUser(payload: UserCreatePayload): Promise<User> {
    const response = await axios.post<User>(BASE_URL, payload);
    return response.data;
  },

  // Update an existing user
  async updateUser(id: number, payload: Partial<UserUpdatePayload>): Promise<User> {
    const response = await axios.put<User>(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  // Delete a user
  async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete<{ success: boolean; message: string }>(
      `${BASE_URL}/${id}`
    );
    return response.data;
  },

  // Login
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(`${AUTH_URL}/login`, payload);
    return response.data;
  },

  // Logout
  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await axios.post<{ success: boolean; message: string }>(
      `${AUTH_URL}/logout`
    );
    return response.data;
  },

  // Change password
  async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> {
    const response = await axios.post<{ success: boolean; message: string }>(
      `${BASE_URL}/${payload.user_id}/change-password`,
      { new_password: payload.new_password }
    );
    return response.data;
  },
};
