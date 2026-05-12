// useAttendance Hook - React hook for attendance operations

import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '@/services';
import { Attendance, AttendanceCreatePayload, AttendanceUpdatePayload, AttendanceFilters } from '@/types';

interface UseAttendanceOptions {
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
  autoFetch?: boolean;
}

export function useAttendance(options: UseAttendanceOptions = {}) {
  const { userId, dateFrom, dateTo, autoFetch = true } = options;
  
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async (filters?: AttendanceFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getAttendance({
        user_id: userId,
        date_from: dateFrom,
        date_to: dateTo,
        ...filters,
      });
      setAttendance(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch attendance');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId, dateFrom, dateTo]);

  const createAttendance = useCallback(async (payload: AttendanceCreatePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await attendanceService.createAttendance(payload);
      setAttendance((prev) => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create attendance');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAttendance = useCallback(async (id: number, payload: AttendanceUpdatePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await attendanceService.updateAttendance(id, payload);
      setAttendance((prev) => prev.map((a) => (a.id === id ? data : a)));
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update attendance');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAttendance = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await attendanceService.deleteAttendance(id);
      setAttendance((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete attendance');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkIn = useCallback(async (userId: number, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    return createAttendance({
      user_id: userId,
      date: today,
      check_in_time: time,
    });
  }, [createAttendance]);

  const checkOut = useCallback(async (attendanceId: number, time: string) => {
    return updateAttendance(attendanceId, {
      check_out_time: time,
    });
  }, [updateAttendance]);

  // Auto-fetch on mount if enabled, or when userId becomes available
  useEffect(() => {
    if (userId) {
      fetchAttendance();
    }
  }, [userId, fetchAttendance]);

  return {
    attendance,
    isLoading,
    error,
    fetchAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    checkIn,
    checkOut,
    clearError: () => setError(null),
  };
}
