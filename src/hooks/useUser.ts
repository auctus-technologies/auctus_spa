// useUser Hook - React hook for user operations

import { useEffect, useCallback } from 'react';
import { useUserStore } from '@/store';
import { UserCreatePayload, LoginPayload } from '@/types';

export function useUser(userId?: number) {
  const {
    users,
    currentUser,
    isAuthenticated,
    usersStatus,
    currentUserStatus,
    loginStatus,
    createStatus,
    updateStatus,
    deleteStatus,
    usersError,
    currentUserError,
    loginError,
    createError,
    updateError,
    deleteError,
    fetchUsers,
    fetchUserById,
    fetchMe,
    login,
    logout,
    createUser,
    updateUser,
    deleteUser,
    clearErrors,
  } = useUserStore();

  // Fetch current user on mount
  useEffect(() => {
    if (currentUserStatus === 'idle' && isAuthenticated) {
      fetchMe();
    }
  }, [currentUserStatus, isAuthenticated, fetchMe]);

  // Fetch specific user when ID changes
  useEffect(() => {
    if (userId && (!currentUser || currentUser.id !== userId)) {
      fetchUserById(userId);
    }
  }, [userId, currentUser, fetchUserById]);

  // Wrapper functions
  const signIn = useCallback(async (payload: LoginPayload) => {
    return await login(payload);
  }, [login]);

  const signOut = useCallback(async () => {
    await logout();
  }, [logout]);

  const create = useCallback(async (payload: UserCreatePayload) => {
    return await createUser(payload);
  }, [createUser]);

  const update = useCallback(async (id: number, payload: Partial<UserCreatePayload>) => {
    return await updateUser(id, payload);
  }, [updateUser]);

  const remove = useCallback(async (id: number) => {
    return await deleteUser(id);
  }, [deleteUser]);

  const refresh = useCallback(() => {
    return fetchUsers();
  }, [fetchUsers]);

  return {
    // Data
    users,
    currentUser,
    isAuthenticated,
    
    // Loading states
    isLoadingUsers: usersStatus === 'loading',
    isLoadingUser: currentUserStatus === 'loading',
    isLoggingIn: loginStatus === 'loading',
    isCreating: createStatus === 'loading',
    isUpdating: updateStatus === 'loading',
    isDeleting: deleteStatus === 'loading',
    
    // Error states
    usersError,
    currentUserError,
    loginError,
    createError,
    updateError,
    deleteError,
    
    // Actions
    fetchUsers: refresh,
    fetchUserById,
    fetchMe,
    login: signIn,
    logout: signOut,
    createUser: create,
    updateUser: update,
    deleteUser: remove,
    clearErrors,
  };
}
