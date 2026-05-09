import { Timestamps } from './common';

export type KlienStatus = 'active' | 'inactive' | 'suspended';

export type LayananType = 'homecare' | 'medical_checkup' | 'konsultasi' | 'lainnya';

export type LayananStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface Klien extends Timestamps {
  id: number;
  user_id: number;
  nama_lengkap: string;
  phone: string;
  email: string;
  alamat: string;
  kota: string;
  provinsi: string;
  status: KlienStatus;
  tanggal_registrasi: string;
  sumber_lead?: string;
  cc_id?: number; // Customer Care yang handle
  total_order?: number;
  total_spending?: number;
}

export interface Pasien extends Timestamps {
  id: number;
  klien_id: number;
  nama: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  kondisi_kesehatan?: string;
  alergi?: string;
  riwayat_penyakit?: string;
  catatan?: string;
}

export interface Layanan extends Timestamps {
  id: number;
  klien_id: number;
  pasien_id: number;
  jenis_layanan: LayananType;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  durasi_hari?: number;
  jam_per_hari: number;
  mitra_id?: number;
  status: LayananStatus;
  alamat_layanan: string;
  kebutuhan_khusus?: string;
  harga_per_jam: number;
  total_harga: number;
  catatan?: string;
}
