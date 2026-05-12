'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API_URL } from '../endpoint/endpoint';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user && pathname.startsWith('/dashboard') && pathname !== '/dashboard/login') {
      router.push('/dashboard/login');
    }
  }, [user, loading, pathname, router]);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        // Only set user if authenticated (not guest)
        if (data.role !== 'guest') {
          setUser(data);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ login_email: email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Fetch fresh user data from /auth/me to get complete profile
        const meRes = await fetch(`${API_URL}/auth/me`, {
          credentials: 'include',
        });
        if (meRes.ok) {
          const userData = await meRes.json();
          if (userData.role !== 'guest') {
            setUser(userData);
          }
        }
        router.push('/dashboard');
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push('/dashboard/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
