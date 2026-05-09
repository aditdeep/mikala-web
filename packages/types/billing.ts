import { Timestamps } from './common';

export type TagihanStatus = 'unpaid' | 'partial' | 'paid' | 'overdue' | 'cancelled';

export type PaymentMethod = 'transfer' | 'cash' | 'qris' | 'va' | 'lainnya';

export interface Tagihan extends Timestamps {
  id: number;
  klien_id: number;
  order_id: number;
  nomor_tagihan: string;
  tanggal_tagihan: string;
  tanggal_jatuh_tempo: string;
  subtotal: number;
  diskon: number;
  pajak: number;
  total: number;
  total_dibayar: number;
  sisa: number;
  status: TagihanStatus;
  catatan?: string;
}

export interface Payment extends Timestamps {
  id: number;
  tagihan_id: number;
  tanggal_bayar: string;
  jumlah: number;
  metode: PaymentMethod;
  nomor_referensi?: string;
  bukti_pembayaran?: string;
  catatan?: string;
}

export interface JurnalKeuangan extends Timestamps {
  id: number;
  tanggal: string;
  jenis: 'income' | 'outcome';
  kategori: string;
  deskripsi: string;
  jumlah: number;
  referensi_id?: number;
  referensi_type?: string; // Tagihan | Payroll | etc
  saldo_setelah: number;
}
