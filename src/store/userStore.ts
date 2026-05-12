// User Store - Zustand store for user state management

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, UserCreatePayload, UserUpdatePayload, LoginPayload, RequestStatus } from '@/types';
import { userService } from '@/services';

interface UserState {
  // Data
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Status
  usersStatus: RequestStatus;
  currentUserStatus: RequestStatus;
  loginStatus: RequestStatus;
  createStatus: RequestStatus;
  updateStatus: RequestStatus;
  deleteStatus: RequestStatus;
  
  // Error
  usersError: string | null;
  currentUserError: string | null;
  loginError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  
  // Actions
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  fetchMe: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  createUser: (payload: UserCreatePayload) => Promise<User | null>;
  updateUser: (id: number, payload: Partial<UserUpdatePayload>) => Promise<User | null>;
  deleteUser: (id: number) => Promise<boolean>;
  setCurrentUser: (user: User | null) => void;
  clearErrors: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        users: [],
        currentUser: null,
        isAuthenticated: false,
        
        usersStatus: 'idle',
        currentUserStatus: 'idle',
        loginStatus: 'idle',
        createStatus: 'idle',
        updateStatus: 'idle',
        deleteStatus: 'idle',
        
        usersError: null,
        currentUserError: null,
        loginError: null,
        createError: null,
        updateError: null,
        deleteError: null,
        
        // Fetch all users
        fetchUsers: async () => {
          set({ usersStatus: 'loading', usersError: null });
          try {
            const users = await userService.getUsers();
            set({ users, usersStatus: 'success' });
          } catch (error: any) {
            set({
              usersStatus: 'error',
              usersError: error.response?.data?.error || 'Failed to fetch users',
            });
          }
        },
        
        // Fetch single user by ID
        fetchUserById: async (id: number) => {
          set({ currentUserStatus: 'loading', currentUserError: null });
          try {
            const user = await userService.getUserById(id);
            set({ currentUser: user, currentUserStatus: 'success' });
          } catch (error: any) {
            set({
              currentUserStatus: 'error',
              currentUserError: error.response?.data?.error || 'Failed to fetch user',
            });
          }
        },
        
        // Fetch current logged-in user
        fetchMe: async () => {
          set({ currentUserStatus: 'loading', currentUserError: null });
          try {
            const user = await userService.getMe();
            set({ currentUser: user, isAuthenticated: true, currentUserStatus: 'success' });
          } catch (error: any) {
            set({
              currentUserStatus: 'error',
              currentUserError: error.response?.data?.error || 'Failed to fetch user',
              isAuthenticated: false,
            });
          }
        },
        
        // Login
        login: async (payload: LoginPayload) => {
          set({ loginStatus: 'loading', loginError: null });
          try {
            const response = await userService.login(payload);
            set({
              currentUser: response.user,
              isAuthenticated: true,
              loginStatus: 'success',
            });
            return true;
          } catch (error: any) {
            set({
              loginStatus: 'error',
              loginError: error.response?.data?.error || 'Invalid credentials',
              isAuthenticated: false,
            });
            return false;
          }
        },
        
        // Logout
        logout: async () => {
          try {
            await userService.logout();
          } finally {
            set({
              currentUser: null,
              isAuthenticated: false,
              users: [],
            });
          }
        },
        
        // Create new user
        createUser: async (payload: UserCreatePayload) => {
          set({ createStatus: 'loading', createError: null });
          try {
            const user = await userService.createUser(payload);
            set((state) => ({
              users: [...state.users, user],
              createStatus: 'success',
            }));
            return user;
          } catch (error: any) {
            set({
              createStatus: 'error',
              createError: error.response?.data?.error || 'Failed to create user',
            });
            return null;
          }
        },
        
        // Update user
        updateUser: async (id: number, payload: Partial<UserUpdatePayload>) => {
          set({ updateStatus: 'loading', updateError: null });
          try {
            const user = await userService.updateUser(id, payload);
            set((state) => ({
              users: state.users.map((u) => (u.id === id ? user : u)),
              currentUser: state.currentUser?.id === id ? user : state.currentUser,
              updateStatus: 'success',
            }));
            return user;
          } catch (error: any) {
            set({
              updateStatus: 'error',
              updateError: error.response?.data?.error || 'Failed to update user',
            });
            return null;
          }
        },
        
        // Delete user
        deleteUser: async (id: number) => {
          set({ deleteStatus: 'loading', deleteError: null });
          try {
            await userService.deleteUser(id);
            set((state) => ({
              users: state.users.filter((u) => u.id !== id),
              currentUser: state.currentUser?.id === id ? null : state.currentUser,
              deleteStatus: 'success',
            }));
            return true;
          } catch (error: any) {
            set({
              deleteStatus: 'error',
              deleteError: error.response?.data?.error || 'Failed to delete user',
            });
            return false;
          }
        },
        
        // Set current user
        setCurrentUser: (user: User | null) => {
          set({ currentUser: user });
        },
        
        // Clear all errors
        clearErrors: () => {
          set({
            usersError: null,
            currentUserError: null,
            loginError: null,
            createError: null,
            updateError: null,
            deleteError: null,
          });
        },
      }),
      {
        name: 'user-store',
        partialize: (state) => ({ currentUser: state.currentUser, isAuthenticated: state.isAuthenticated }),
      }
    ),
    { name: 'user-store' }
  )
);
