import { useEffect } from 'react';
import { useNotifStore } from '@mikala/store';
import { api } from '@mikala/lib';
import { Notifikasi } from '@mikala/types';

export function useNotifikasi() {
  const { notifikasi, unreadCount, setNotifikasi, addNotifikasi, markAsRead, markAllAsRead } = useNotifStore();

  // Fetch notifications
  const fetchNotifikasi = async () => {
    try {
      const response = await api.get<{ data: Notifikasi[] }>('/internal/dashboard/notifikasi');
      setNotifikasi(response.data.data);
    } catch (error) {
      console.error('Failed to fetch notifikasi:', error);
    }
  };

  // Mark as read
  const markRead = async (id: number) => {
    try {
      await api.patch(`/internal/notifikasi/${id}/read`);
      markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notifikasi as read:', error);
    }
  };

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    fetchNotifikasi();
    
    const interval = setInterval(() => {
      fetchNotifikasi();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    notifikasi,
    unreadCount,
    fetchNotifikasi,
    markAsRead: markRead,
    markAllAsRead,
    addNotifikasi,
  };
}
