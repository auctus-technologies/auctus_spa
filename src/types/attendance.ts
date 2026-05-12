// Attendance Types - Payload definitions for API communication

export interface Attendance {
  id: number;
  user_id: number;
  user_name: string;
  date: string;
  check_in_time: string;
  check_out_time: string | null;
  status: string;
}

export interface AttendanceCreatePayload {
  user_id: number;
  date: string;
  check_in_time: string;
  check_out_time?: string | null;
  status?: string;
}

export interface AttendanceUpdatePayload {
  check_in_time?: string;
  check_out_time?: string | null;
  status?: string;
}

export interface AttendanceStats {
  total_employees: number;
  present_today: number;
  leave_today: number;
  late_checkins: number;
}

export interface AttendanceFilters {
  user_id?: number;
  date_from?: string;
  date_to?: string;
}
