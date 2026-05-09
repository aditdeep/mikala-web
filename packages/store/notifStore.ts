import { create } from 'zustand';
import { Notifikasi } from '@mikala/types';

interface NotifState {
  notifikasi: Notifikasi[];
  unreadCount: number;
  setNotifikasi: (notif: Notifikasi[]) => void;
  addNotifikasi: (notif: Notifikasi) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

export const useNotifStore = create<NotifState>((set) => ({
  notifikasi: [],
  unreadCount: 0,
  
  setNotifikasi: (notif) => set({ 
    notifikasi: notif,
    unreadCount: notif.filter(n => !n.read_at).length
  }),
  
  addNotifikasi: (notif) => set((state) => ({
    notifikasi: [notif, ...state.notifikasi],
    unreadCount: state.unreadCount + 1
  })),
  
  markAsRead: (id) => set((state) => ({
    notifikasi: state.notifikasi.map(n => 
      n.id === id ? { ...n, read_at: new Date().toISOString() } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),
  
  markAllAsRead: () => set((state) => ({
    notifikasi: state.notifikasi.map(n => ({
      ...n,
      read_at: n.read_at || new Date().toISOString()
    })),
    unreadCount: 0
  })),
}));
