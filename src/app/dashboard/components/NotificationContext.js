'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { API_URL } from '../endpoint/endpoint';

const NotificationContext = createContext(null);

function playDing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (_) {}
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const prevUnread = useRef(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      const count = data.unread_count || 0;
      if (count > prevUnread.current) playDing();
      prevUnread.current = count;
      setUnreadCount(count);
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 5000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  const markRead = async (id) => {
    await fetch(`${API_URL}/notifications/${id}/read`, { method: 'POST', credentials: 'include' });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    prevUnread.current = Math.max(0, prevUnread.current - 1);
  };

  const markAllRead = async () => {
    await fetch(`${API_URL}/notifications/read-all`, { method: 'POST', credentials: 'include' });
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    prevUnread.current = 0;
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, refresh: fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
