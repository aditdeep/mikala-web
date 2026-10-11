import * as SecureStore from 'expo-secure-store';
import api from './api';
import { registerPushNotifications } from './notifications';

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data.data || res.data;
    await SecureStore.setItemAsync('auth_token', token);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
    // Daftarkan HP utk push notif langsung setelah login. Sebelumnya cuma dipanggil saat app
    // dibuka dalam keadaan sudah login, jadi login pertama kali gak pernah dapat push.
    registerPushNotifications().catch(() => {});
    return { token, user };
  },
  async logout() {
    try { await api.post('/auth/logout'); } catch {}
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('auth_user');
  },
  async getUser() {
    const str = await SecureStore.getItemAsync('auth_user');
    return str ? JSON.parse(str) : null;
  },
  async isAuthenticated() {
    const token = await SecureStore.getItemAsync('auth_token');
    return !!token;
  },
};
