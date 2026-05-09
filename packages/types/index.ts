// Common types
export * from './common';

// User types
export * from './user';

// Mitra types
export * from './mitra';

// Klien types
export * from './klien';

// Order types
export * from './order';

// Billing types
export * from './billing';

// Notifikasi type
export interface Notifikasi {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read_at?: string;
  created_at: string;
  data?: Record<string, any>;
}
