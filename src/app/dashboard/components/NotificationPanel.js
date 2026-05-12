'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNotifications } from './NotificationContext';

function NotifIcon({ type, unread }) {
  const color = unread ? 'text-primary' : 'text-gray-400';
  if (type === 'project_assigned') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mt-0.5 shrink-0 ${color}`}>
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    );
  }
  if (type === 'leave_submitted') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mt-0.5 shrink-0 ${color}`}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/>
        <line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    );
  }
  if (type === 'leave_approved') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mt-0.5 shrink-0 text-green-500`}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    );
  }
  if (type === 'leave_rejected') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mt-0.5 shrink-0 text-red-500`}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mt-0.5 shrink-0 ${color}`}>
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationPanel() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications() || {};
  const [open, setOpen]   = useState(false);
  const panelRef          = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!panelRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={panelRef} className="relative">

      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 m-0">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary font-medium border-0 bg-transparent cursor-pointer hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {!notifications || notifications.length === 0 ? (
              <li className="flex flex-col items-center justify-center py-10 text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200 mb-2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <p className="text-sm text-gray-400 m-0">No notifications yet</p>
              </li>
            ) : notifications.map(n => (
              <li
                key={n.id}
                onClick={() => !n.is_read && markRead(n.id)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}
              >
                <NotifIcon type={n.notif_type} unread={!n.is_read} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 m-0 leading-snug">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 m-0 leading-relaxed">{n.message}</p>
                  <p className="text-[11px] text-gray-400 mt-1 m-0">{timeAgo(n.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Footer */}
          {notifications?.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 m-0">{notifications.length} notification{notifications.length !== 1 ? 's' : ''} total</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
