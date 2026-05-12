'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';

const DEV_DESIGNATIONS = [
  'software_engineer', 'senior_developer', 'junior_developer',
  'team_lead', 'qa_engineer', 'devops_engineer',
];

const allNavItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Admins',
    href: '/dashboard/admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    roles: ['admin'],
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    excludeDesignations: DEV_DESIGNATIONS,
  },
  {
    label: 'Projects',
    href: '/dashboard/projects',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    label: 'Clients',
    href: '/dashboard/clients',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-4-4h-4"/>
        <circle cx="17" cy="7" r="4"/>
      </svg>
    ),
    excludeDesignations: DEV_DESIGNATIONS,
  },
  {
    label: 'Tasks',
    href: '/dashboard/tasks',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    label: 'Leads',
    href: '/dashboard/leads',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="8.5" cy="7" r="4"/>
        <line x1="20" y1="8" x2="20" y2="14"/>
        <line x1="23" y1="11" x2="17" y2="11"/>
      </svg>
    ),
    excludeDesignations: DEV_DESIGNATIONS,
  },
  {
    label: 'Attendance',
    href: '/dashboard/attendance',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Salary',
    href: '/dashboard/salary',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    roles: ['admin'],
  },
  {
    label: 'Openings',
    href: '/dashboard/openings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    excludeDesignations: DEV_DESIGNATIONS,
  },
  {
    label: 'Job Applications',
    href: '/dashboard/job-applications',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    roles: ['admin', 'hr'],
  },
  {
    label: 'Leave Applications',
    href: '/dashboard/applications',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h3"/>
        <polyline points="14,2 14,8"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="9" y1="18" x2="15" y2="22"/>
      </svg>
    ),
  },
  {
    label: 'Holidays',
    href: '/dashboard/holidays',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="8" y1="14" x2="8" y2="14"/>
        <line x1="12" y1="14" x2="12" y2="14"/>
        <line x1="16" y1="14" x2="16" y2="14"/>
      </svg>
    ),
    roles: ['admin'],
  },
];

const CollapseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 9l-3 3 3 3"/>
  </svg>
);

const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M13 9l3 3-3 3"/>
  </svg>
);

export default function DashboardSidebar({ sidebarOpen, setSidebarOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const userRole = user?.role?.toLowerCase();
  const userDesignation = user?.designation?.toLowerCase();
  const userDepartment = user?.department?.toLowerCase();
  const isSalesMarketing = ['marketing', 'sales'].includes(userDepartment);
  const SALES_MARKETING_ALLOWED = ['/dashboard', '/dashboard/leads', '/dashboard/applications', '/dashboard/attendance'];

  const navItems = allNavItems.filter(item => {
    if (isSalesMarketing) return SALES_MARKETING_ALLOWED.includes(item.href);
    if (item.roles && item.roles.length > 0 && !item.roles.includes(userRole)) return false;
    if (item.excludeDesignations && userDesignation && item.excludeDesignations.includes(userDesignation)) return false;
    return true;
  });

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-100 flex flex-col
      transition-all duration-200 ease-in-out
      lg:static lg:z-auto lg:translate-x-0
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      ${collapsed ? 'lg:w-[60px]' : 'lg:w-60'}
      w-60
    `}>

      {/* Logo + collapse toggle */}
      <div className={`h-16 border-b border-gray-100 shrink-0 flex items-center justify-between transition-all duration-200 ${collapsed ? 'px-2' : 'px-4'}`}>
        <img
          src="/assets/images/logo/logo-1.svg"
          alt="Auctus"
          className={`h-7 transition-all duration-200 ${collapsed ? 'hidden' : 'block'}`}
        />
        {collapsed && <div className="flex-1" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ExpandIcon /> : <CollapseIcon />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden px-2">
        {!collapsed && (
          <p className="px-3 mb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Main menu
          </p>
        )}
        <ul className="space-y-0.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors no-underline
                    ${collapsed ? 'justify-center px-0 py-2' : 'px-3 py-2'}
                    ${active
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                >
                  <span className={`shrink-0 ${active ? 'text-primary' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className={`border-t border-gray-100 shrink-0 transition-all duration-200 ${collapsed ? 'px-2 py-2' : 'px-3 py-3'}`}>
        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-0 bg-transparent cursor-pointer
            ${collapsed ? 'justify-center px-0 py-2' : 'px-3 py-2'}`}
          title="Logout"
        >
          <span className="shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
