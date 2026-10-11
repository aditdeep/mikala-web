import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: 'https://api.mikalaglobalmedika.com/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('auth_user');
      // Sesi habis (mis. password direset admin -> semua token di-revoke): balik ke login,
      // sebelumnya user tertahan di layar dgn data kosong.
      if (!String(error.config?.url || '').includes('/auth/')) {
        router.replace('/(auth)/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
