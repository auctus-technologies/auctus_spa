// Employee Store - Zustand store for employee state management

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Employee, EmployeeCreatePayload, EmployeeUpdatePayload, RequestStatus } from '@/types';
import { employeeService } from '@/services';

interface EmployeeState {
  // Data
  employees: Employee[];
  currentEmployee: Employee | null;
  
  // Status
  employeesStatus: RequestStatus;
  currentEmployeeStatus: RequestStatus;
  createStatus: RequestStatus;
  updateStatus: RequestStatus;
  deleteStatus: RequestStatus;
  
  // Error
  employeesError: string | null;
  currentEmployeeError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  
  // Actions
  fetchEmployees: () => Promise<void>;
  fetchEmployeeById: (id: number) => Promise<void>;
  createEmployee: (payload: EmployeeCreatePayload) => Promise<Employee | null>;
  updateEmployee: (id: number, payload: Partial<EmployeeCreatePayload>) => Promise<Employee | null>;
  deleteEmployee: (id: number) => Promise<boolean>;
  setCurrentEmployee: (employee: Employee | null) => void;
  clearErrors: () => void;
}

export const useEmployeeStore = create<EmployeeState>()(
  devtools(
    (set, get) => ({
      // Initial state
      employees: [],
      currentEmployee: null,
      
      employeesStatus: 'idle',
      currentEmployeeStatus: 'idle',
      createStatus: 'idle',
      updateStatus: 'idle',
      deleteStatus: 'idle',
      
      employeesError: null,
      currentEmployeeError: null,
      createError: null,
      updateError: null,
      deleteError: null,
      
      // Fetch all employees
      fetchEmployees: async () => {
        set({ employeesStatus: 'loading', employeesError: null });
        try {
          const employees = await employeeService.getEmployees();
          set({ employees, employeesStatus: 'success' });
        } catch (error: any) {
          set({
            employeesStatus: 'error',
            employeesError: error.response?.data?.error || 'Failed to fetch employees',
          });
        }
      },
      
      // Fetch single employee by ID
      fetchEmployeeById: async (id: number) => {
        set({ currentEmployeeStatus: 'loading', currentEmployeeError: null });
        try {
          const employee = await employeeService.getEmployeeById(id);
          set({ currentEmployee: employee, currentEmployeeStatus: 'success' });
        } catch (error: any) {
          set({
            currentEmployeeStatus: 'error',
            currentEmployeeError: error.response?.data?.error || 'Failed to fetch employee',
          });
        }
      },
      
      // Create new employee
      createEmployee: async (payload: EmployeeCreatePayload) => {
        set({ createStatus: 'loading', createError: null });
        try {
          const employee = await employeeService.createEmployee(payload);
          set((state) => ({
            employees: [...state.employees, employee],
            createStatus: 'success',
          }));
          return employee;
        } catch (error: any) {
          set({
            createStatus: 'error',
            createError: error.response?.data?.error || 'Failed to create employee',
          });
          return null;
        }
      },
      
      // Update employee
      updateEmployee: async (id: number, payload: Partial<EmployeeCreatePayload>) => {
        set({ updateStatus: 'loading', updateError: null });
        try {
          const employee = await employeeService.updateEmployee(id, payload);
          set((state) => ({
            employees: state.employees.map((e) => (e.id === id ? employee : e)),
            currentEmployee: state.currentEmployee?.id === id ? employee : state.currentEmployee,
            updateStatus: 'success',
          }));
          return employee;
        } catch (error: any) {
          set({
            updateStatus: 'error',
            updateError: error.response?.data?.error || 'Failed to update employee',
          });
          return null;
        }
      },
      
      // Delete employee
      deleteEmployee: async (id: number) => {
        set({ deleteStatus: 'loading', deleteError: null });
        try {
          await employeeService.deleteEmployee(id);
          set((state) => ({
            employees: state.employees.filter((e) => e.id !== id),
            currentEmployee: state.currentEmployee?.id === id ? null : state.currentEmployee,
            deleteStatus: 'success',
          }));
          return true;
        } catch (error: any) {
          set({
            deleteStatus: 'error',
            deleteError: error.response?.data?.error || 'Failed to delete employee',
          });
          return false;
        }
      },
      
      // Set current employee (for UI state)
      setCurrentEmployee: (employee: Employee | null) => {
        set({ currentEmployee: employee });
      },
      
      // Clear all errors
      clearErrors: () => {
        set({
          employeesError: null,
          currentEmployeeError: null,
          createError: null,
          updateError: null,
          deleteError: null,
        });
      },
    }),
    { name: 'employee-store' }
  )
);
