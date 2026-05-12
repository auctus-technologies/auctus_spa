'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/dashboard/components/AuthContext';
import { useAttendance } from '@/hooks';
import { API_URL } from '../endpoint/endpoint';

const STATUS_CONFIG = {
  present: {
    badge: 'P',
    badgeCls: 'bg-green-100 text-green-800',
    pillCls: 'bg-green-100 text-green-800',
    dotCls: 'bg-green-500',
    label: 'Present',
  },
  leave: {
    badge: 'L',
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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const LEAVE_TYPE_LABELS = {
  sick_leave: 'Sick Leave',
  casual_leave: 'Casual Leave',
  maternity_leave: 'Maternity Leave',
  medical_leave: 'Medical Leave',
  condolences_leave: 'Condolences Leave',
};

const fmtKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const parseTime = (t) => {
  if (!t) return null;
  const [h, min] = t.split(':').map(Number);
  return h * 60 + min;
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

export default function AttendancePage() {
  const { user } = useAuth();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [holidayMap, setHolidayMap] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);

  const {
    attendance,
    isLoading,
    error,
  } = useAttendance({ userId: user?.id, autoFetch: true });

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
    fetch(`${API_URL}/leave-requests`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setLeaveRequests(data || []);
      })
      .catch(() => {});
  }, []);

  const y = currentMonth.getFullYear();
  const m = currentMonth.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstDay = new Date(y, m, 1).getDay();

  const getAttendanceForDay = (day) => {
    const key = fmtKey(y, m, day);
    return attendance.find((a) => a.date === key);
  };

  const getLeaveForDay = (day) => {
    const key = fmtKey(y, m, day);
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

  // Monthly stats
  const calcStats = () => {
    let present = 0, leave = 0, lateCount = 0, holidays = 0;
    const userCheckInMinutes = user?.check_in_time ? parseTime(user.check_in_time) : null;

    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = new Date(y, m, d).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { holidays++; continue; }

      const key = fmtKey(y, m, d);
      if (holidayMap[key]) { holidays++; continue; }

      // Check for approved leave on this day (only count on weekdays)
      const leaveForDay = getLeaveForDay(d);
      if (leaveForDay && leaveForDay.status === 'approved') { leave++; continue; }

      const record = getAttendanceForDay(d);
      if (!record) continue;
      if (record.status === 'leave') { leave++; continue; }
      if (record.status === 'holiday') { holidays++; continue; }

      const checkInMinutes = parseTime(record.check_in_time);
      if (checkInMinutes || record.check_out_time) {
        present++;
        if (record.status === 'late' || (checkInMinutes && userCheckInMinutes !== null && checkInMinutes > userCheckInMinutes)) lateCount++;
      }
    }

    const workingDays = daysInMonth - holidays;
    const rate = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0;
    return { daysInMonth, workingDays, present, leave, lateCount, holidays };
  };

  const stats = calcStats();

  const prevMonth = () => { setCurrentMonth(new Date(y, m - 1, 1)); setSelectedDay(1); };
  const nextMonth = () => { setCurrentMonth(new Date(y, m + 1, 1)); setSelectedDay(1); };

  // Selected day detail
  const selRecord = getAttendanceForDay(selectedDay);
  const selDate = new Date(y, m, selectedDay);
  const selDayOfWeek = selDate.getDay();
  const selIsWeekend = selDayOfWeek === 0 || selDayOfWeek === 6;
  const userCheckInMinutes = user?.check_in_time ? parseTime(user.check_in_time) : null;

  let selStatus = 'no-data';
  let selIsLate = false;
  if (selIsWeekend) {
    selStatus = 'weekend';
  } else if (selRecord) {
    if (selRecord.status && selRecord.status !== 'present') {
      selStatus = selRecord.status;
    } else {
      const checkInMinutes = parseTime(selRecord.check_in_time);
      if (checkInMinutes) {
        selIsLate = userCheckInMinutes !== null && checkInMinutes > userCheckInMinutes;
        selStatus = 'present';
      }
    }
  }

  const selConfig = STATUS_CONFIG[selStatus];
  const workingHours = selRecord ? calcHours(selRecord.check_in_time, selRecord.check_out_time) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">My Attendance</h1>
        {user && (
          <p className="text-sm text-gray-500 mt-0.5">{user.name || user.email}</p>
        )}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-gray-500 text-sm">Loading attendance data…</div>
      ) : error ? (
        <div className="py-16 text-center text-red-500 text-sm">{error}</div>
      ) : (
        <div className="flex gap-4 items-start">

          {/* Calendar */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Calendar header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
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

              {/* Legend */}
              <div className="flex items-center gap-3">
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
              {DAYS.map((day) => (
                <div key={day} className="py-2 text-center text-xs font-semibold tracking-widest uppercase text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {/* Empty leading cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} className="border-r border-b border-gray-100 bg-gray-50 min-h-[80px]" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const key = fmtKey(y, m, d);
                const dayOfWeek = new Date(y, m, d).getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const record = getAttendanceForDay(d);
                const isSelected = d === selectedDay;
                const isLastCol = (firstDay + i + 1) % 7 === 0;
                const holidayName = holidayMap[key];

                const today = new Date();
                const isToday =
                  d === today.getDate() &&
                  currentMonth.getMonth() === today.getMonth() &&
                  currentMonth.getFullYear() === today.getFullYear();

                let isLate = false;
                let recordStatus = record?.status || null;
                const leaveForDay = getLeaveForDay(d);

                if (record && !isWeekend) {
                  const checkInMinutes = parseTime(record.check_in_time);
                  isLate = record.status === 'late' || (!!checkInMinutes && userCheckInMinutes !== null && checkInMinutes > userCheckInMinutes);
                }

                const checkInBadgeClass = isLate
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-500 text-white';

                const getStatusBadge = () => {
                  if (!recordStatus || recordStatus === 'present') return null;
                  const statusConfig = {
                    leave: { bg: 'bg-red-500', text: 'Leave' },
                    holiday: { bg: 'bg-blue-500', text: 'Holiday' },
                  };
                  const cfg = statusConfig[recordStatus];
                  if (!cfg) return null;
                  return (
                    <span className={`block text-[10px] font-medium px-2 py-1 rounded-md text-center ${cfg.bg} text-white`}>
                      {cfg.text}
                    </span>
                  );
                };

                return (
                  <div
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={[
                      'min-h-[80px] border-b border-gray-100 p-2 cursor-pointer transition-colors',
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

                    {/* Weekend badge */}
                    {isWeekend && !holidayName && (
                      <span className="block text-[10px] font-medium px-2 py-1 rounded-md text-center bg-gray-200 text-gray-500">
                        Weekend
                      </span>
                    )}

                    {/* Holiday badge (public holiday — overrides weekend label) */}
                    {holidayName && (
                      <div className="mb-1">
                        <span className="block text-[10px] font-medium px-2 py-1 rounded-md text-center bg-blue-500 text-white truncate" title={holidayName}>
                          {holidayName}
                        </span>
                      </div>
                    )}

                    {/* Leave status badge - skip for weekends and holidays */}
                    {!isWeekend && !holidayName && leaveForDay && (
                      <div className="mb-1">
                        {getLeaveStatusBadge(leaveForDay)}
                      </div>
                    )}

                    {/* Status / time badges — skip for weekends and holidays */}
                    {!isWeekend && !holidayName && (
                      <>
                        {recordStatus && recordStatus !== 'present' && (
                          <div className="mb-1">{getStatusBadge()}</div>
                        )}
                        {recordStatus !== 'leave' && recordStatus !== 'holiday' && (
                          <div className="space-y-1">
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-56 flex flex-col gap-3">

            {/* Monthly summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Monthly summary</p>

              {[
                { label: 'Total days',   val: stats.daysInMonth, cls: 'text-gray-800' },
                { label: 'Working days', val: stats.workingDays, cls: 'text-gray-800' },
                {
                  label: 'Present',
                  val: stats.present,
                  cls: 'text-green-700',
                  subInfo: stats.lateCount > 0 ? { text: `${stats.lateCount} late`, cls: 'text-amber-600' } : null,
                },
                { label: 'Leave',   val: stats.leave,   cls: 'text-red-600' },
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

            {/* Selected date detail */}
            <div className="bg-white rounded-xl border border-gray-200 p-3">
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

              {selRecord && (
                <div className="flex gap-2 mb-2">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Check in</p>
                    <p className="text-xs font-semibold font-mono text-gray-800">
                      {fmt12(selRecord.check_in_time)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Check out</p>
                    <p className="text-xs font-semibold font-mono text-gray-800">
                      {fmt12(selRecord.check_out_time)}
                    </p>
                  </div>
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
    </div>
  );
}
