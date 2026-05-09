import { Timestamps } from './common';

export type MitraStatus = 
  | 'pendaftar' 
  | 'training' 
  | 'available' 
  | 'on_job' 
  | 're_training' 
  | 'off' 
  | 'keluar';

export type TrainingStatus = 'scheduled' | 'in_progress' | 'completed' | 'failed';

export type PayrollStatus = 'pending' | 'paid' | 'cancelled';

export interface Mitra extends Timestamps {
  id: number;
  user_id: number;
  nik: string;
  nama_lengkap: string;
  tanggal_lahir: string;
  alamat: string;
  kota: string;
  provinsi: string;
  phone: string;
  email: string;
  pendidikan: string;
  pengalaman: string;
  status: MitraStatus;
  tanggal_bergabung: string;
  tanggal_keluar?: string;
  sumber_rekrutmen: string; // agen | institusi | langsung
  agen_id?: number;
  dokumen_ktp?: string;
  dokumen_cv?: string;
  dokumen_sertifikat?: string;
  foto?: string;
  rating?: number;
  total_job?: number;
}

export interface Training extends Timestamps {
  id: number;
  mitra_id: number;
  jenis: string; // basic | advanced | refresher
  tanggal_mulai: string;
  tanggal_selesai?: string;
  status: TrainingStatus;
  checklist?: Record<string, boolean>;
  feedback?: string;
  trainer_id?: number;
  biaya: number;
}

export interface Payroll extends Timestamps {
  id: number;
  mitra_id: number;
  periode: string; // YYYY-MM
  jumlah_job: number;
  total_jam: number;
  total_pendapatan: number;
  potongan: number;
  bonus: number;
  total_bayar: number;
  status: PayrollStatus;
  tanggal_bayar?: string;
  metode_pembayaran?: string;
  bukti_transfer?: string;
}

export interface Job extends Timestamps {
  id: number;
  order_id: number;
  mitra_id: number;
  klien_id: number;
  pasien_id: number;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  jam_kerja: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  catatan?: string;
  rating?: number;
  feedback?: string;
}
