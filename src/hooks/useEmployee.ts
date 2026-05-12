// useEmployee Hook - React hook for employee operations

import { useEffect, useCallback } from 'react';
import { useEmployeeStore } from '@/store';
import { EmployeeCreatePayload } from '@/types';

export function useEmployee(employeeId?: number) {
  const {
    employees,
    currentEmployee,
    employeesStatus,
    currentEmployeeStatus,
    createStatus,
    updateStatus,
    deleteStatus,
    employeesError,
    currentEmployeeError,
    createError,
    updateError,
    deleteError,
    fetchEmployees,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setCurrentEmployee,
    clearErrors,
  } = useEmployeeStore();

  // Fetch employees on mount
  useEffect(() => {
    if (employeesStatus === 'idle') {
      fetchEmployees();
    }
  }, [employeesStatus, fetchEmployees]);

  // Fetch specific employee when ID changes
  useEffect(() => {
    if (employeeId && (!currentEmployee || currentEmployee.id !== employeeId)) {
      fetchEmployeeById(employeeId);
    }
  }, [employeeId, currentEmployee, fetchEmployeeById]);

  // Wrapper functions with loading states
  const create = useCallback(async (payload: EmployeeCreatePayload) => {
    return await createEmployee(payload);
  }, [createEmployee]);

  const update = useCallback(async (id: number, payload: Partial<EmployeeCreatePayload>) => {
    return await updateEmployee(id, payload);
  }, [updateEmployee]);

  const remove = useCallback(async (id: number) => {
    return await deleteEmployee(id);
  }, [deleteEmployee]);

  const refresh = useCallback(() => {
    return fetchEmployees();
  }, [fetchEmployees]);

  const selectEmployee = useCallback((employee: typeof currentEmployee) => {
    setCurrentEmployee(employee);
  }, [setCurrentEmployee]);

  return {
    // Data
    employees,
    currentEmployee,
    
    // Loading states
    isLoadingEmployees: employeesStatus === 'loading',
    isLoadingEmployee: currentEmployeeStatus === 'loading',
    isCreating: createStatus === 'loading',
    isUpdating: updateStatus === 'loading',
    isDeleting: deleteStatus === 'loading',
    
    // Error states
    employeesError,
    currentEmployeeError,
    createError,
    updateError,
    deleteError,
    
    // Actions
    fetchEmployees: refresh,
    fetchEmployeeById,
    createEmployee: create,
    updateEmployee: update,
    deleteEmployee: remove,
    setCurrentEmployee: selectEmployee,
    clearErrors,
  };
}
