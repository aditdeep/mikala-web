import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('mikala_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mikala_token');
        localStorage.removeItem('mikala_user');
        const loginPath = process.env.NEXT_PUBLIC_LOGIN_PATH || '/auth/login';
        window.location.href = loginPath;
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

// Helper function for GET requests
export const get = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return api.get<T>(url, config);
};

// Helper function for POST requests
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return api.post<T>(url, data, config);
};

// Helper function for PATCH requests
export const patch = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return api.patch<T>(url, data, config);
};

// Helper function for DELETE requests
export const del = <T = any>(url: string, config?: AxiosRequestConfig) => {
  return api.delete<T>(url, config);
};
