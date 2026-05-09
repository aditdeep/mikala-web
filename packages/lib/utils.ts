import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to Indonesian locale
export function formatDate(date: string | Date, formatStr: string = 'dd MMMM yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: id });
}

// Format date with time
export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd MMM yyyy, HH:mm');
}

// Format relative time (e.g., "2 jam yang lalu")
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: id });
}

// Format currency to Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with thousands separator
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

// Status badge color mapper
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Generic
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    
    // Mitra status
    pendaftar: 'bg-purple-100 text-purple-800',
    training: 'bg-blue-100 text-blue-800',
    available: 'bg-green-100 text-green-800',
    on_job: 'bg-cyan-100 text-cyan-800',
    re_training: 'bg-orange-100 text-orange-800',
    off: 'bg-gray-100 text-gray-800',
    keluar: 'bg-red-100 text-red-800',
    
    // Payment status
    paid: 'bg-green-100 text-green-800',
    unpaid: 'bg-red-100 text-red-800',
    partial: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800',
    
    // Order status
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-cyan-100 text-cyan-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

// Status label mapper (Indonesian)
export function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    // Generic
    active: 'Aktif',
    inactive: 'Tidak Aktif',
    pending: 'Menunggu',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    
    // Mitra status
    pendaftar: 'Pendaftar',
    training: 'Training',
    available: 'Tersedia',
    on_job: 'Sedang Bertugas',
    re_training: 'Re-Training',
    off: 'Off',
    keluar: 'Keluar',
    
    // Payment status
    paid: 'Lunas',
    unpaid: 'Belum Bayar',
    partial: 'Dibayar Sebagian',
    overdue: 'Jatuh Tempo',
    
    // Order status
    confirmed: 'Dikonfirmasi',
    in_progress: 'Berlangsung',
  };
  
  return statusLabels[status] || status;
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone (Indonesian format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
