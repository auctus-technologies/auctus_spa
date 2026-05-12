// API service for connecting Next.js frontend with Django-Ninja backend

import { API_URL } from '../app/dashboard/endpoint/endpoint';

const API_BASE_URL = API_URL;

// Export functions for dashboard
export async function getDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/dashboard/stats`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE_URL}/health`, { credentials: 'include' });
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

// Helper function for API calls
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add credentials for CORS
  if (typeof window !== 'undefined') {
    config.credentials = 'include';
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Leads API
export const leadsApi = {
  list: () => apiRequest('/leads'),
  create: (data) => apiRequest('/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Clients API
export const clientsApi = {
  list: () => apiRequest('/clients'),
  create: (data) => apiRequest('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Projects API
export const projectsApi = {
  list: () => apiRequest('/projects'),
  create: (data) => apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Users API
export const usersApi = {
  list: () => apiRequest('/users'),
};

// Leave Types API
export async function getLeaveTypes() {
  const res = await fetch(`${API_BASE_URL}/leave-types`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch leave types');
  return res.json();
}

// Authentication API
export const authApi = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  me: () => apiRequest('/auth/me'),
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
};

export default {
  checkHealth,
  getDashboardStats,
  leads: leadsApi,
  clients: clientsApi,
  projects: projectsApi,
  users: usersApi,
  auth: authApi,
};
