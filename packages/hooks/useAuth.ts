import { useEffect } from 'react';
import { useAuthStore } from '@mikala/store';
import { auth } from '@mikala/lib';
import { LoginCredentials } from '@mikala/types';

export function useAuth() {
  const { user, isLoading, setUser, setLoading, clearAuth } = useAuthStore();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = auth.getUser();
      if (storedUser) {
        setUser(storedUser);
      } else {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [setUser, setLoading]);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const { user } = await auth.login(credentials);
      setUser(user);
      return user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } finally {
      clearAuth();
    }
  };

  const refreshUser = async () => {
    try {
      const user = await auth.fetchUser();
      setUser(user);
      return user;
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };
}
