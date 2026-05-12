import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types';
import { API_URL } from '@/app/dashboard/endpoint/endpoint';

const API_BASE_URL = API_URL;

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Handle unauthorized - redirect to login
        window.location.href = '/login';
      }
      
      if (status === 403) {
        // Handle forbidden
        console.error('Access forbidden:', data?.error);
      }
      
      if (status === 500) {
        // Handle server error
        console.error('Server error:', data?.error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
