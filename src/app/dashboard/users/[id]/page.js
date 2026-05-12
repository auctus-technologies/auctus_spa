'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/dashboard/components/AuthContext';
import { useToast } from '@/app/dashboard/components/ToastContext';
import { useAttendance } from '@/hooks';
import { API_URL, BASE_URL } from '@/app/dashboard/endpoint/endpoint';
import {
  ArrowLeft, User, Mail, Phone, Calendar, Briefcase,
  CreditCard, FileText, Clock, DollarSign,
  ShieldCheck, ChevronRight, X
} from 'lucide-react';
import MinimalSelect from '@/components/MinimalSelect';

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Attendance calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isEditingAttendance, setIsEditingAttendance] = useState(false);
  const [isCreatingAttendance, setIsCreatingAttendance] = useState(false);
  const [editAttendanceData, setEditAttendanceData] = useState({
    check_in_time: '',
    check_out_time: '',
    status: '',
  });
  const [holidayMap, setHolidayMap] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);

  const [salary,        setSalary]        = useState(null);
  const [salaryLoading, setSalaryLoading] = useState(false);

  // Fetch attendance data when user is loaded
  const {
    attendance,
    isLoading: isLoadingAttendance,
    error: attendanceError,
    updateAttendance,
    createAttendance,
  } = useAttendance({
    userId: user?.id,
    autoFetch: true, // Fetch automatically when userId is available
  });

  // Attendance status configuration
  const STATUS_CONFIG = {
    present: {
      badge: 'P',
      badgeCls: 'bg-green-100 text-green-800',
      pillCls: 'bg-green-100 text-green-800',
      dotCls: 'bg-green-500',
      label: 'Present',
    },
    leave: {
      badge: 'A',
      badgeCls: 'bg-red-100 text-red-800',
      pillCls: 'bg-red-100 text-red-800',
      dotCls: 'bg-red-500',
      label: 'Leave',
    },
    late: {
      badge: 'L',
      badgeCls: 'bg-amber-100 text-amber-800',
      pillCls: 'bg-amber-100 text-amber-800',
      dotCls: 'bg-amber-500',
      label: 'Late',
    },
    holiday: {
      badge: 'H',
      badgeCls: 'bg-blue-100 text-blue-800',
      pillCls: 'bg-blue-100 text-blue-800',
      dotCls: 'bg-blue-500',
      label: 'Holiday',
    },
    weekend: {
      badge: 'W',
      badgeCls: 'bg-gray-100 text-gray-500',
      pillCls: 'bg-gray-100 text-gray-500',
      dotCls: 'bg-gray-400',
      label: 'Weekend',
    },
  };

  // Helper functions for attendance calendar
  const fmtKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  
  const parseTime = (t) => {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const fmt12 = (t) => {
    if (!t) return '—';
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  };
  
  const calcHours = (ci, co) => {
    const a = parseTime(ci);
    const b = parseTime(co);
    if (a == null || b == null) return null;
    return ((b - a) / 60).toFixed(1);
  };
  
  const calcStats = (y, m, attendanceData) => {
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    let present = 0, leave = 0, lateCount = 0, holidays = 0;

    const userCheckInMinutes = user?.checkInTime ? parseTime(user.checkInTime) : null;

    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = new Date(y, m, d).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      if (isWeekend) { holidays++; continue; }

      const key = fmtKey(y, m, d);
      if (holidayMap[key]) { holidays++; continue; }

      // Check for approved leave on this day (only count on weekdays)
      const leaveForDay = getLeaveForDay(y, m, d);
      if (leaveForDay && leaveForDay.status === 'approved') { leave++; continue; }

      const record = attendanceData.find(a => a.date === key);
      if (!record) continue;

      if (record.status === 'leave') { leave++; continue; }
      if (record.status === 'holiday') { holidays++; continue; }

      const checkInMinutes = parseTime(record.check_in_time);
      if (checkInMinutes) {
        present++;
        if (record.status === 'late' || (userCheckInMinutes !== null && checkInMinutes > userCheckInMinutes)) lateCount++;
      } else if (record.check_out_time) {
        present++;
      }
    }

    const workingDays = daysInMonth - holidays;
    const rate = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0;
    return { daysInMonth, workingDays, present, leave, lateCount, holidays };
  };

  const getLeaveForDay = (y, m, d) => {
    const key = fmtKey(y, m, d);
    return leaveRequests.find((l) => {
      const startDate = new Date(l.start_date);
      const endDate = new Date(l.end_date);
      const checkDate = new Date(key);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const getLeaveStatusBadge = (leave) => {
    if (!leave) return null;
    const leaveTypeName = LEAVE_TYPE_LABELS[leave.leave_type] || leave.leave_type;
    const statusConfig = {
      pending: { bg: 'bg-amber-500', text: `${leaveTypeName} (Pending)` },
      approved: { bg: 'bg-green-500', text: `${leaveTypeName} (Approved)` },
      rejected: { bg: 'bg-red-500', text: `${leaveTypeName} (Rejected)` },
    };
    const cfg = statusConfig[leave.status];
    if (!cfg) return null;
    return (
      <span className={`block text-[10px] font-medium px-2 py-1 rounded-md text-center ${cfg.bg} text-white truncate`} title={cfg.text}>
        {cfg.text}
      </span>
    );
  };

  // Check if current user can change password for viewed user
  const canChangePassword = () => {
    if (!currentUser || !user) return false;
    
    const currentUserRole = currentUser.role?.toLowerCase();
    const targetUserRole = user.role?.toLowerCase();
    const isOwnProfile = currentUser._id === params.id || currentUser.id === params.id;
    
    // Admin can change any password
    if (currentUserRole === 'admin') return true;
    // Manager can change password except for Admin
    if (currentUserRole === 'manager') return targetUserRole !== 'admin';
    // TL can change password except for Admin and Manager
    if (currentUserRole === 'tl') return targetUserRole !== 'admin' && targetUserRole !== 'manager';
    // Others can only change their own password
    return isOwnProfile;
  };

  // Check if current user is admin (for attendance edit)
  const isAdmin = () => {
    if (!currentUser) return false;
    return currentUser.role?.toLowerCase() === 'admin';
  };

  // Check if current user can access users list
  const canAccessUsers = () => {
    if (!currentUser) return false;
    const role = currentUser.role?.toLowerCase();
    return ['admin', 'manager', 'hr', 'tl'].includes(role);
  };

  const handleBack = () => {
    if (canAccessUsers()) {
      router.push('/dashboard/users');
    } else {
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  useEffect(() => {
    fetch(`${API_URL}/holidays`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const map = {};
        (data.holidays || []).forEach(h => { map[h.date] = h.name; });
        setHolidayMap(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${API_URL}/leave-requests?user_id=${user.id}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setLeaveRequests(data || []);
      })
      .catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || activeTab !== 'salary') return;
    setSalaryLoading(true);
    fetch(`${API_URL}/salary?user_id=${user.id}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { setSalary(data?.salaries?.[0] || null); })
      .catch(() => {})
      .finally(() => setSalaryLoading(false));
  }, [user?.id, activeTab]);

  const handleChangePassword = async () => {
    if (!params.id || params.id === 'undefined') {
      addToast('Invalid user ID', 'error');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/users/${params.id}/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          new_password: passwordData.newPassword
        })
      });

      if (res.ok) {
        addToast('Password changed successfully', 'success');
        setChangePasswordModal(false);
        setPasswordData({ newPassword: '', confirmPassword: '' });
      } else {
        const error = await res.json();
        addToast(error.error || 'Failed to change password', 'error');
      }
    } catch (err) {
      addToast('Network error while changing password', 'error');
    }
  };

  const openChangePasswordModal = () => {
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setChangePasswordModal(true);
  };

  const fetchUser = async () => {
    if (!params.id || params.id === 'undefined') {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/employees/${params.id}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const transformedUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          login_email: data.login_email,
          role: data.role.charAt(0).toUpperCase() + data.role.slice(1),
          status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
          joinDate: data.join_date ? new Date(data.join_date).toISOString().split('T')[0] : '',
          employeeId: data.employee_id || '',
          designation: data.designation || '',
          personalNumber: data.phone || '',
          department: data.department || '',
          dateOfBirth: data.date_of_birth || '',
          gender: data.gender || '',
          fathersName: data.fathers_name || '',
          maritalStatus: data.marital_status || '',
          bloodGroup: data.blood_group || '',
          religion: data.religion || '',
          address: data.address || {},
          checkInTime: data.check_in_time || '',
          checkOutTime: data.check_out_time || '',
          accountNumber: data.bank?.account_number || '',
          bankName: data.bank?.bank_name || '',
          ifscCode: data.bank?.ifsc_code || '',
          avatar: data.avatar_url ? `${BASE_URL}${data.avatar_url}` : '',
        };
        setUser(transformedUser);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch user');
      }
    } catch (err) {
      setError('Network error while fetching user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{error ? 'Error Loading Profile' : 'User Not Found'}</h1>
          <p className="text-gray-500 text-sm">{error || "This profile doesn't exist."}</p>
          <button onClick={handleBack}
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Back to {canAccessUsers() ? 'Users' : 'Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal',     label: 'Personal',     icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'attendance',   label: 'Attendance',   icon: Clock },
    { id: 'payslip',      label: 'Payslip',      icon: CreditCard },
    { id: 'salary',       label: 'Salary',       icon: DollarSign },
  ];

  const fmtDesignation = (val) => val ? val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '';

  const Field = ({ label, value }) => (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-base text-gray-800 font-medium">{value || <span className="text-gray-300 font-normal">—</span>}</p>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="px-6 py-5">
        {children}
      </div>
    </div>
  );

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const LEAVE_TYPE_LABELS = {
    sick_leave: 'Sick Leave',
    casual_leave: 'Casual Leave',
    maternity_leave: 'Maternity Leave',
    medical_leave: 'Medical Leave',
    condolences_leave: 'Condolences Leave',
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-4">
            <Section title="Personal Information">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                <Field label="First Name"     value={user.name.split(' ')[0]} />
                <Field label="Last Name"      value={user.name.split(' ').slice(1).join(' ') || ''} />
                <Field label="Designation"    value={fmtDesignation(user.designation)} />
                <Field label="Employee ID"    value={user.employeeId} />
                <Field label="Personal Mail"  value={user.email} />
                <Field label="Office Mail"    value={user.login_email} />
                <Field label="Phone Number"   value={user.personalNumber} />
                <Field label="Date of Birth"  value={user.dateOfBirth} />
                <Field label="Gender"         value={user.gender} />
                <Field label="Father's Name"  value={user.fathersName} />
                <Field label="Marital Status" value={user.maritalStatus} />
                <Field label="Blood Group"    value={user.bloodGroup} />
                <Field label="Religion"       value={user.religion} />
              </div>
            </Section>
            <Section title="Address">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                <Field label="Street"       value={user.address?.street} />
                <Field label="City"         value={user.address?.city} />
                <Field label="State"        value={user.address?.state} />
                <Field label="ZIP Code"     value={user.address?.zip_code} />
                <Field label="Country"      value={user.address?.country} />
              </div>
            </Section>
            <Section title="Bank Account Details">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                <Field label="Account Number" value={user.accountNumber} />
                <Field label="Bank Name"      value={user.bankName} />
                <Field label="IFSC Code"      value={user.ifscCode} />
              </div>
            </Section>
          </div>
        );

      case 'professional':
        return (
          <Section title="Professional Information">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
              <Field label="Role"            value={user.role} />
              <Field label="Designation"     value={user.designation} />
              <Field label="Date of Joining" value={user.joinDate} />
              <Field label="Check-In Time"  value={fmt12(user.checkInTime)} />
              <Field label="Check-Out Time" value={fmt12(user.checkOutTime)} />
            </div>
          </Section>
        );

      case 'attendance':
        // Calculate calendar data
        const y = currentMonth.getFullYear();
        const m = currentMonth.getMonth();
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const firstDay = new Date(y, m, 1).getDay();
        const stats = calcStats(y, m, attendance);
        
        const selectedKey = fmtKey(y, m, selectedDay);
        const selRecord = attendance.find(a => a.date === selectedKey);
        const selDayOfWeek = new Date(y, m, selectedDay).getDay();
        const selIsWeekend = selDayOfWeek === 0 || selDayOfWeek === 6;

        // Determine status for selected day
        let selStatus = 'no-data';
        let selIsLate = false;
        if (selIsWeekend) {
          selStatus = 'weekend';
        } else if (selRecord) {
          // Check explicit status first
          if (selRecord.status && selRecord.status !== 'present') {
            selStatus = selRecord.status;
          } else {
            const checkInMinutes = parseTime(selRecord.check_in_time);
            const userCheckInMinutes = user?.checkInTime ? parseTime(user.checkInTime) : null;
            if (checkInMinutes) {
              selIsLate = userCheckInMinutes !== null && checkInMinutes > userCheckInMinutes;
              selStatus = 'present';
            }
          }
        }
        
        const selConfig = STATUS_CONFIG[selStatus];
        const workingHours = selRecord ? calcHours(selRecord.check_in_time, selRecord.check_out_time) : null;
        const selDate = new Date(y, m, selectedDay);
        
        const prevMonth = () => {
          setCurrentMonth(new Date(y, m - 1, 1));
          setSelectedDay(1);
        };
        const nextMonth = () => {
          setCurrentMonth(new Date(y, m + 1, 1));
          setSelectedDay(1);
        };
        
        // Convert API attendance data to calendar format
        const getAttendanceForDay = (day) => {
          const key = fmtKey(y, m, day);
          return attendance.find(a => a.date === key);
        };
        
        return (
          <div className="space-y-4">
            <Section title="Attendance Records">
              {isLoadingAttendance ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Loading attendance data...</p>
                </div>
              ) : attendanceError ? (
                <div className="py-8 text-center">
                  <p className="text-red-500">{attendanceError}</p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-4 items-start">
                  {/* Calendar */}
                  <div className="flex-1 bg-white rounded-xl border border-gray-200">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-y-2 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={prevMonth}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15,18 9,12 15,6" />
                          </svg>
                        </button>
                        <h3 className="text-base font-semibold text-gray-900 min-w-[140px] text-center">
                          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button
                          onClick={nextMonth}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9,18 15,12 9,6" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Legend — hidden on small screens */}
                      <div className="hidden sm:flex items-center gap-3 flex-wrap">
                        {Object.entries(STATUS_CONFIG)
                          .filter(([key]) => key !== 'weekend' && key !== 'late')
                          .map(([key, cfg]) => (
                            <div key={key} className="flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${cfg.dotCls}`} />
                              <span className="text-xs text-gray-500">{cfg.label}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* Day headers */}
                    <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                      {DAYS.map(day => (
                        <div key={day} className="py-1 sm:py-2 text-center text-xs font-semibold tracking-widest uppercase text-gray-400">
                          <span className="sm:hidden">{day.slice(0, 1)}</span>
                          <span className="hidden sm:inline">{day}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7">
                      {/* Empty cells */}
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`e-${i}`} className="border-r border-b border-gray-100 bg-gray-50 min-h-[44px] sm:min-h-[70px]" />
                      ))}
                      
                      {/* Day cells */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const d = i + 1;
                        const key = fmtKey(y, m, d);
                        const dayOfWeek = new Date(y, m, d).getDay();
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                        const record = getAttendanceForDay(d);
                        const holidayName = holidayMap[key];
                        const leaveForDay = getLeaveForDay(y, m, d);
                        let isLate = false;
                        let recordStatus = null;

                        if (record && !isWeekend) {
                          recordStatus = record.status;
                          const checkInMinutes = parseTime(record.check_in_time);
                          const userCheckInMinutes = user?.checkInTime ? parseTime(user.checkInTime) : null;
                          isLate = record.status === 'late' || (!!checkInMinutes && userCheckInMinutes !== null && checkInMinutes > userCheckInMinutes);
                        }

                        const isSelected = d === selectedDay;
                        const isLastCol = (firstDay + i + 1) % 7 === 0;
                        const today = new Date();
                        const isToday =
                          d === today.getDate() &&
                          currentMonth.getMonth() === today.getMonth() &&
                          currentMonth.getFullYear() === today.getFullYear();

                        const checkInBadgeClass = isLate
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-500 text-white';

                        const getStatusBadge = () => {
                          if (!recordStatus || recordStatus === 'present') return null;
                          const statusConfig = {
                            leave: { bg: 'bg-red-500', text: 'Leave' },
                            holiday: { bg: 'bg-blue-500', text: 'Holiday' },
                          };
                          const config = statusConfig[recordStatus];
                          if (!config) return null;
                          return (
                            <span className={`block text-[10px] font-medium px-2 py-1 rounded-md text-center ${config.bg} text-white`}>
                              {config.text}
                            </span>
                          );
                        };

                        return (
                          <div
                            key={d}
                            onClick={() => setSelectedDay(d)}
                            className={[
                              'min-h-[44px] sm:min-h-[80px] border-b border-gray-100 p-1 sm:p-2 cursor-pointer transition-colors',
                              isLastCol ? '' : 'border-r',
                              isSelected
                                ? 'bg-blue-50 border-blue-200'
                                : isWeekend
                                  ? 'bg-gray-50/80 hover:bg-gray-100/60'
                                  : holidayName
                                    ? 'bg-blue-50/50 hover:bg-blue-50/80'
                                    : isToday
                                      ? 'bg-blue-50/40'
                                      : 'bg-white hover:bg-gray-50',
                            ].join(' ')}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className={[
                                'text-xs font-medium flex items-center justify-center',
                                isToday
                                  ? 'w-5 h-5 rounded-full bg-blue-600 text-white'
                                  : isWeekend
                                    ? 'text-gray-400'
                                    : !record && !holidayName ? 'text-gray-400' : 'text-gray-600',
                              ].join(' ')}>
                                {d}
                              </span>
                            </div>

                            {/* Mobile: single status dot */}
                            <div className="sm:hidden flex justify-center mt-0.5">
                              {isWeekend && !holidayName && <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                              {holidayName && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                              {!isWeekend && !holidayName && leaveForDay && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                              {!isWeekend && !holidayName && !leaveForDay && recordStatus === 'leave' && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                              {!isWeekend && !holidayName && record?.check_in_time && recordStatus !== 'leave' && (
                                <span className={`w-1.5 h-1.5 rounded-full ${isLate ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                              )}
                            </div>

                            {/* Desktop: full badge content */}
                            <>
                              {isWeekend && !holidayName && (
                                <span className="hidden sm:block text-[10px] font-medium px-2 py-1 rounded-md text-center bg-gray-200 text-gray-500">
                                  Weekend
                                </span>
                              )}

                              {holidayName && (
                                <div className="hidden sm:block mb-1">
                                  <span className="block text-[10px] font-medium px-2 py-1 rounded-md text-center bg-blue-500 text-white truncate" title={holidayName}>
                                    {holidayName}
                                  </span>
                                </div>
                              )}

                              {!isWeekend && !holidayName && leaveForDay && (
                                <div className="hidden sm:block mb-1">
                                  {getLeaveStatusBadge(leaveForDay)}
                                </div>
                              )}

                              {!isWeekend && !holidayName && (
                                <>
                                  {recordStatus && recordStatus !== 'present' && (
                                    <div className="hidden sm:block mb-1">{getStatusBadge()}</div>
                                  )}
                                  {recordStatus !== 'leave' && recordStatus !== 'holiday' && (
                                    <div className="hidden sm:block space-y-1">
                                      {record?.check_in_time && (
                                        <span className={`block text-[10px] font-medium font-mono px-2 py-1 rounded-md text-center ${checkInBadgeClass}`}>
                                          {fmt12(record.check_in_time)}
                                        </span>
                                      )}
                                      {record?.check_out_time && (
                                        <span className="block text-[10px] font-medium font-mono px-2 py-1 rounded-md text-center bg-emerald-500 text-white">
                                          {fmt12(record.check_out_time)}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Sidebar */}
                  <div className="w-full lg:w-56 flex flex-col sm:flex-row lg:flex-col gap-3 overflow-visible">
                    {/* Monthly Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-3 flex-1 lg:flex-none">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Monthly summary</p>
                      
                      {[
                        { label: 'Total days', val: stats.daysInMonth, cls: 'text-gray-800' },
                        { label: 'Working days', val: stats.workingDays, cls: 'text-gray-800' },
                        { 
                          label: 'Present', 
                          val: stats.present, 
                          cls: 'text-green-700',
                          subInfo: stats.lateCount > 0 ? { text: `${stats.lateCount} late`, cls: 'text-amber-600' } : null
                        },
                        { label: 'Leave', val: stats.leave, cls: 'text-red-600' },
                        { label: 'Holidays', val: stats.holidays, cls: 'text-blue-600' },
                      ].map(({ label, val, cls, subInfo }) => (
                        <div key={label} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                          <span className="text-xs text-gray-500">{label}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${cls}`}>{val}</span>
                            {subInfo && (
                              <span className={`text-[10px] ${subInfo.cls}`}>({subInfo.text})</span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Attendance rate bar */}
                      {/* <div className="mt-2">
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-green-500 transition-all duration-500"
                            style={{ width: `${stats.rate}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-gray-400">Rate</span>
                          <span className="text-[10px] font-semibold text-gray-600">{stats.rate}%</span>
                        </div>
                      </div> */}
                    </div>
                    
                    {/* Selected Date Detail */}
                    <div className="bg-white rounded-xl border border-gray-200 p-3 overflow-visible flex-1 lg:flex-none">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Selected date</p>

                      <div className="mb-2">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Date</p>
                        <p className="text-xs font-medium text-gray-800">
                          {selDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                      </div>

                      {holidayMap[fmtKey(y, m, selectedDay)] && (
                        <div className="mb-2">
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Holiday</p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {holidayMap[fmtKey(y, m, selectedDay)]}
                          </span>
                        </div>
                      )}

                      <div className="mb-2">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Status</p>
                        {selConfig ? (
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${selConfig.pillCls}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${selConfig.dotCls}`} />
                              {selConfig.label}
                            </span>
                            {selIsLate && (
                              <span className="text-[10px] text-amber-600">(late)</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No data</span>
                        )}
                      </div>
                      
                      {/* Create Attendance for Admin when no record exists */}
                      {!selRecord && isAdmin() && (
                        <div className="mb-2">
                          {!isCreatingAttendance ? (
                            <button
                              onClick={() => {
                                setEditAttendanceData({
                                  check_in_time: '',
                                  check_out_time: '',
                                  status: 'present',
                                });
                                setIsCreatingAttendance(true);
                              }}
                              className="w-full px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                            >
                              + Add Attendance
                            </button>
                          ) : (
                            <div className="space-y-2">
                              {/* Status Dropdown */}
                              <div className="relative z-20">
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Status</p>
                                <MinimalSelect
                                  value={editAttendanceData.status || 'present'}
                                  onChange={(e) => setEditAttendanceData(prev => ({ ...prev, status: e.target.value }))}
                                >
                                  <option value="present">Present</option>
                                  <option value="leave">Leave</option>
                                  <option value="holiday">Holiday</option>
                                </MinimalSelect>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Check in</p>
                                  <input
                                    type="time"
                                    value={editAttendanceData.check_in_time}
                                    onChange={(e) => setEditAttendanceData(prev => ({ ...prev, check_in_time: e.target.value }))}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Check out</p>
                                  <input
                                    type="time"
                                    value={editAttendanceData.check_out_time}
                                    onChange={(e) => setEditAttendanceData(prev => ({ ...prev, check_out_time: e.target.value }))}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    const selectedDate = fmtKey(y, m, selectedDay);
                                    const explicitStatus = editAttendanceData.status;
                                    const resolvedStatus = (() => {
                                      if (explicitStatus === 'leave' || explicitStatus === 'holiday') return explicitStatus;
                                      const ciMins = parseTime(editAttendanceData.check_in_time);
                                      const scheduledMins = user?.checkInTime ? parseTime(user.checkInTime) : null;
                                      if (ciMins && scheduledMins !== null && ciMins > scheduledMins) return 'late';
                                      return 'present';
                                    })();
                                    const success = await createAttendance({
                                      user_id: user.id,
                                      date: selectedDate,
                                      check_in_time: editAttendanceData.check_in_time,
                                      check_out_time: editAttendanceData.check_out_time || null,
                                      status: resolvedStatus,
                                    });
                                    if (success) {
                                      setIsCreatingAttendance(false);
                                      setEditAttendanceData({ check_in_time: '', check_out_time: '', status: '' });
                                      addToast('Attendance created successfully', 'success');
                                    } else {
                                      addToast('Failed to create attendance', 'error');
                                    }
                                  }}
                                  className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                                >
                                  Create
                                </button>
                                <button
                                  onClick={() => {
                                    setIsCreatingAttendance(false);
                                    setEditAttendanceData({ check_in_time: '', check_out_time: '', status: '' });
                                  }}
                                  className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {selRecord && (
                        <div className="mb-2">
                          {!isEditingAttendance ? (
                            <>
                              <div className="flex gap-2 mb-2">
                                <div className="flex-1">
                                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Check in</p>
                                  <p className="text-xs font-semibold font-mono text-gray-800">{selRecord.check_in_time ? fmt12(selRecord.check_in_time) : 'No data'}</p>
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Check out</p>
                                  <p className="text-xs font-semibold font-mono text-gray-800">{selRecord.check_out_time ? fmt12(selRecord.check_out_time) : 'No data'}</p>
                                </div>
                              </div>
                              {isAdmin() && (
                                <button
                                  onClick={() => {
                                    setEditAttendanceData({
                                      check_in_time: selRecord.check_in_time ? selRecord.check_in_time.slice(0, 5) : '',
                                      check_out_time: selRecord.check_out_time ? selRecord.check_out_time.slice(0, 5) : '',
                                      status: selRecord.status || 'present',
                                    });
                                    setIsEditingAttendance(true);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                  Edit
                                </button>
                              )}
                            </>
                          ) : (
                            <div className="space-y-2">
                              {/* Status Dropdown */}
                              <div className="relative z-20">
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Status</p>
                                <MinimalSelect
                                  value={editAttendanceData.status || 'present'}
                                  onChange={(e) => setEditAttendanceData(prev => ({ ...prev, status: e.target.value }))}
                                >
                                  <option value="present">Present</option>
                                  <option value="leave">Leave</option>
                                  <option value="holiday">Holiday</option>
                                </MinimalSelect>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Check in</p>
                                  <input
                                    type="time"
                                    value={editAttendanceData.check_in_time}
                                    onChange={(e) => setEditAttendanceData(prev => ({ ...prev, check_in_time: e.target.value }))}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Check out</p>
                                  <input
                                    type="time"
                                    value={editAttendanceData.check_out_time}
                                    onChange={(e) => setEditAttendanceData(prev => ({ ...prev, check_out_time: e.target.value }))}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    const updatedStatus = (() => {
                                      const s = editAttendanceData.status;
                                      if (s === 'leave' || s === 'holiday') return s;
                                      const ciMins = parseTime(editAttendanceData.check_in_time);
                                      const scheduledMins = user?.checkInTime ? parseTime(user.checkInTime) : null;
                                      if (ciMins && scheduledMins !== null && ciMins > scheduledMins) return 'late';
                                      return 'present';
                                    })();
                                    const success = await updateAttendance(selRecord.id, {
                                      check_in_time: editAttendanceData.check_in_time,
                                      check_out_time: editAttendanceData.check_out_time || null,
                                      status: updatedStatus,
                                    });
                                    if (success) {
                                      setIsEditingAttendance(false);
                                      addToast('Attendance updated successfully', 'success');
                                    } else {
                                      addToast('Failed to update attendance', 'error');
                                    }
                                  }}
                                  className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setIsEditingAttendance(false);
                                    setEditAttendanceData({ check_in_time: '', check_out_time: '', status: '' });
                                  }}
                                  className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {workingHours && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Working hours</p>
                          <div className="inline-block bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                            <span className="text-lg font-semibold font-mono text-gray-800 tracking-tight">
                              {workingHours}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">hrs</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Section>
          </div>
        );

      case 'salary': {
        const fmtCur = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
        const salGross = salary
          ? [salary.basic, salary.hra, salary.da, salary.travel_allowance, salary.medical_allowance, salary.other_allowance]
              .reduce((s, v) => s + Number(v || 0), 0)
          : 0;
        const salDeductions = salary
          ? [salary.pf, salary.esi, salary.professional_tax, salary.tds, salary.other_deduction]
              .reduce((s, v) => s + Number(v || 0), 0)
          : 0;
        const salNet = salGross - salDeductions;

        if (salaryLoading) {
          return (
            <div className="py-16 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading salary details…</p>
            </div>
          );
        }

        if (!salary) {
          return (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">No salary structure set up</p>
              <p className="text-xs text-gray-400 mt-1">Add a salary record from the Salary Setup page.</p>
            </div>
          );
        }

        const earningsRows = [
          { label: 'Basic Salary', val: salary.basic, highlight: true },
          { label: 'HRA',               val: salary.hra },
          { label: 'DA',                val: salary.da },
          { label: 'Travel Allowance',  val: salary.travel_allowance },
          { label: 'Medical Allowance', val: salary.medical_allowance },
          { label: 'Other Allowance',   val: salary.other_allowance },
        ];
        const deductionRows = [
          { label: 'PF (Employee)',    val: salary.pf },
          { label: 'ESI',              val: salary.esi },
          { label: 'Professional Tax', val: salary.professional_tax },
          { label: 'TDS',              val: salary.tds },
          { label: 'Other Deduction',  val: salary.other_deduction },
        ];

        return (
          <div className="space-y-4">

            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Gross Salary',   value: fmtCur(salGross),      sub: 'before deductions' },
                { label: 'Deductions',     value: `−${fmtCur(salDeductions)}`, sub: 'PF, ESI, TDS & PT' },
                { label: 'Net Take-Home',  value: fmtCur(salNet),        sub: 'per month' },
              ].map(({ label, value, sub }) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
                  <p className="text-base font-bold text-gray-800 leading-none">{value}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
                </div>
              ))}
            </div>

            {/* Earnings + Deductions side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Earnings */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Earnings</h3>
                </div>
                <div className="px-5 divide-y divide-gray-100">
                  {earningsRows.map(({ label, val, highlight }) => (
                    <div key={label} className="flex items-center justify-between py-3">
                      <span className={`text-sm ${highlight ? 'font-medium text-gray-700' : 'text-gray-500'}`}>{label}</span>
                      <span className={`text-sm font-medium tabular-nums ${Number(val) > 0 ? 'text-gray-800' : 'text-gray-300'}`}>
                        {fmtCur(val)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">Gross Total</span>
                  <span className="text-sm font-bold text-gray-800 tabular-nums">{fmtCur(salGross)}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deductions</h3>
                </div>
                <div className="px-5 divide-y divide-gray-100">
                  {deductionRows.map(({ label, val }) => (
                    <div key={label} className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className={`text-sm font-medium tabular-nums ${Number(val) > 0 ? 'text-gray-800' : 'text-gray-300'}`}>
                        {Number(val) > 0 ? `−${fmtCur(val)}` : fmtCur(val)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">Total Deductions</span>
                  <span className="text-sm font-bold text-gray-800 tabular-nums">−{fmtCur(salDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Net take-home footer */}
            <div className="flex items-center justify-between px-6 py-4 rounded-xl border border-gray-200 bg-gray-50">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Take-Home Salary</p>
                {salary.effective_date && (
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Effective {new Date(salary.effective_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{fmtCur(salNet)}</p>
            </div>

          </div>
        );
      }

      default:
        return (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium">No data available</p>
              <p className="text-xs text-gray-300 mt-1">This section has no records yet.</p>
            </div>
          </div>
        );
    }
  };

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-gray-50/70 min-h-screen">

      {/* ── Top Nav Bar ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(
              <button
                onClick={() => router.push('/dashboard/users')}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2 text-base text-gray-500">
                <>
                  <span className="hover:text-gray-700 cursor-pointer" onClick={() => router.push('/dashboard/users')}>
                    Users
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </>
              
              <span className="text-gray-900 font-semibold text-base">{user.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canChangePassword() && (
              <button
                onClick={openChangePasswordModal}
                className="px-3.5 py-1.5 rounded-lg bg-red-500 text-base font-medium text-white hover:bg-red-600 transition-colors"
              >
                Change Password
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="px-6 py-6 space-y-5">

        {/* ── Profile Hero Card ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold tracking-tight select-none overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                user.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{user.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{fmtDesignation(user.designation) || 'No designation set'}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                {user.email && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {user.email}
                  </span>
                )}
                {user.personalNumber && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {user.personalNumber}
                  </span>
                )}
                {user.joinDate && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    Joined {user.joinDate}
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  user.status === 'Active'
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                    : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                  {user.status}
                </span>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 flex-shrink-0">
              <div className="text-center px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Employee ID</p>
                <p className="text-sm font-bold text-gray-800">{user.employeeId || '—'}</p>
              </div>
              <div className="text-center px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Role</p>
                <p className="text-sm font-bold text-gray-800">{user.role || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs + Content ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="border-b border-gray-100 px-4 overflow-x-auto">
            <nav className="flex gap-0 -mb-px">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`group flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${activeTab === id ? 'text-primary' : 'text-gray-300 group-hover:text-gray-400'}`} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-5">
            {renderTabContent()}
          </div>
        </div>

      </div>

      {/* ── Change Password Modal ── */}
      {changePasswordModal && (
        /* Solid dark overlay — no blur, clearly visible */
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setChangePasswordModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <button
                onClick={() => setChangePasswordModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setChangePasswordModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}