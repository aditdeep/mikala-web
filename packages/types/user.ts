import { Timestamps } from './common';

export type UserRole = 
  | 'manajemen' 
  | 'customer_care' 
  | 'training_center' 
  | 'rekrutmen' 
  | 'finance' 
  | 'marketing' 
  | 'mitra' 
  | 'klien';

export type UserDivision = 
  | 'rekrutmen' 
  | 'training' 
  | 'customer_care' 
  | 'finance' 
  | 'marketing' 
  | 'manajemen'
  | null;

export interface User extends Timestamps {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  division?: UserDivision;
  avatar?: string;
  is_active: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
