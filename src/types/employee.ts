// Employee Types - Payload definitions for API communication

export interface Address {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface BankDetails {
  account_number: string;
  bank_name: string;
  ifsc_code: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  login_email: string;
  role: string;
  status: string;
  employee_id: string;
  department: string;
  designation: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  fathers_name: string | null;
  marital_status: string | null;
  blood_group: string | null;
  religion: string | null;
  check_in_time: string | null;
  check_out_time: string | null;
  join_date: string;
  avatar_url: string | null;
  address: Address | null;
  bank: BankDetails | null;
}

export interface EmployeeCreatePayload {
  name: string;
  email: string;
  login_email: string;
  password: string;
  employee_id?: string;
  department: string;
  designation: string;
  phone?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  fathers_name?: string | null;
  marital_status?: string | null;
  blood_group?: string | null;
  religion?: string | null;
  check_in_time?: string | null;
  check_out_time?: string | null;
  avatar_base64?: string | null;
  address?: Address;
  bank?: BankDetails;
}

export interface EmployeeUpdatePayload extends Partial<EmployeeCreatePayload> {
  id: number;
}

export interface EmployeeListResponse {
  employees: Employee[];
  count: number;
}

export interface EmployeeResponse {
  employee: Employee;
}
