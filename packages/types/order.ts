import { Timestamps } from './common';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface Order extends Timestamps {
  id: number;
  klien_id: number;
  pasien_id: number;
  mitra_id?: number;
  jenis_layanan: string;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  status: OrderStatus;
  total_harga: number;
  catatan?: string;
}
