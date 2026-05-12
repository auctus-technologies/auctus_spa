// Attendance Service - API calls for attendance operations

import axios from '@/lib/axios';
import {
  Attendance,
  AttendanceCreatePayload,
  AttendanceUpdatePayload,
  AttendanceStats,
  AttendanceFilters,
} from '@/types';

const BASE_URL = '/attendance';

export const attendanceService = {
  // Get attendance records with optional filtering
  async getAttendance(filters?: AttendanceFilters): Promise<Attendance[]> {
    const response = await axios.get<Attendance[]>(BASE_URL, { params: filters });
    return response.data;
  },

  // Get attendance for a specific user
  async getUserAttendance(userId: number, dateFrom?: string, dateTo?: string): Promise<Attendance[]> {
    const response = await axios.get<Attendance[]>(BASE_URL, {
      params: {
        user_id: userId,
        date_from: dateFrom,
        date_to: dateTo,
      },
    });
    return response.data;
  },

  // Create a new attendance record
  async createAttendance(payload: AttendanceCreatePayload): Promise<Attendance> {
    const response = await axios.post<Attendance>(BASE_URL, payload);
    return response.data;
  },

  // Update an attendance record
  async updateAttendance(id: number, payload: AttendanceUpdatePayload): Promise<Attendance> {
    const response = await axios.put<Attendance>(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  // Delete an attendance record
  async deleteAttendance(id: number): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete<{ success: boolean; message: string }>(
      `${BASE_URL}/${id}`
    );
    return response.data;
  },

  // Get attendance statistics
  async getAttendanceStats(): Promise<AttendanceStats> {
    const response = await axios.get<AttendanceStats>(`${BASE_URL}/stats`);
    return response.data;
  },

  // Check in user
  async checkIn(userId: number, time: string): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];
    return this.createAttendance({
      user_id: userId,
      date: today,
      check_in_time: time,
    });
  },

  // Check out user
  async checkOut(attendanceId: number, time: string): Promise<Attendance> {
    return this.updateAttendance(attendanceId, {
      check_out_time: time,
    });
  },
};
