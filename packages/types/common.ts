// Common types for API responses and pagination
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';

export interface Timestamps {
  created_at: string;
  updated_at: string;
}
