// Employee Service - API calls for employee operations

import axios from '@/lib/axios';
import {
  Employee,
  EmployeeCreatePayload,
  EmployeeUpdatePayload,
  EmployeeListResponse,
  PaginationParams,
  SortParams,
  FilterParams,
} from '@/types';

const BASE_URL = '/employees';

export const employeeService = {
  // Get all employees with optional filtering, pagination, and sorting
  async getEmployees(
    params?: PaginationParams & SortParams & FilterParams
  ): Promise<Employee[]> {
    const response = await axios.get<EmployeeListResponse>(BASE_URL, { params });
    return response.data.employees;
  },

  // Get a single employee by ID
  async getEmployeeById(id: number): Promise<Employee> {
    const response = await axios.get<Employee>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Create a new employee
  async createEmployee(payload: EmployeeCreatePayload): Promise<Employee> {
    const response = await axios.post<Employee>(BASE_URL, payload);
    return response.data;
  },

  // Update an existing employee
  async updateEmployee(
    id: number,
    payload: Partial<EmployeeCreatePayload>
  ): Promise<Employee> {
    const response = await axios.put<Employee>(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  // Delete an employee
  async deleteEmployee(id: number): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete<{ success: boolean; message: string }>(
      `${BASE_URL}/${id}`
    );
    return response.data;
  },

  // Search employees by name or email
  async searchEmployees(query: string): Promise<Employee[]> {
    const response = await axios.get<EmployeeListResponse>(BASE_URL, {
      params: { search: query },
    });
    return response.data.employees;
  },

  // Get employees by department
  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    const response = await axios.get<EmployeeListResponse>(BASE_URL, {
      params: { department },
    });
    return response.data.employees;
  },
};
