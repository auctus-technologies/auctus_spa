'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { NotificationProvider } from './NotificationContext';
import NotificationPanel from './NotificationPanel';
import DashboardSidebar from './DashboardSidebar';

function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isAuthPage = pathname === '/dashboard/login';
  if (isAuthPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 gap-3 shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer"
            aria-label="Open sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div className="flex-1" />

          <NotificationPanel />

          {/* Profile - only for employees */}
          {user?.role === 'employee' && (
            <Link
              href={user?.id ? `/dashboard/users/${user.id}` : '#'}
              className="flex items-center p-1 rounded-full hover:bg-gray-50 transition-colors no-underline"
              title={user?.name || 'Profile'}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0 overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = user?.name?.charAt(0)?.toUpperCase() || 'A'; }}
                  />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'A'
                )}
              </div>
            </Link>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>

      </div>
    </div>
  );
}

const DashboardShellWithNotifications = ({ children }) => (
  <NotificationProvider>
    <DashboardShell>{children}</DashboardShell>
  </NotificationProvider>
);

export { DashboardShellWithNotifications as default };
