import { User, AuthResponse, LoginCredentials } from '@mikala/types';
import api from './api';

const TOKEN_KEY = 'mikala_token';
const USER_KEY = 'mikala_user';

export const auth = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store token and user in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      // Clear local storage regardless of API response
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  },

  // Get current user from localStorage
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Get token from localStorage
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Fetch user from API
  async fetchUser(): Promise<User> {
    const response = await api.get<{ user: User }>('/auth/me');
    const user = response.data.user;
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    
    return user;
  },

  // Check if user has specific role
  hasRole(role: string | string[]): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  },

  // Check if user has specific division
  hasDivision(division: string | string[]): boolean {
    const user = this.getUser();
    if (!user || !user.division) return false;
    
    const divisions = Array.isArray(division) ? division : [division];
    return divisions.includes(user.division);
  },
};

export default auth;
