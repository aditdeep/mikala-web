'use client';
import { useState } from 'react';

// Kartu Dashboard: jumlah mitra (sudah diterima Rekrutmen) per kelompok tipe pekerjaan, masing2
// bisa difilter status. Data: summary.mitra_per_tipe dari DashboardController::mitraPerTipe().
const TIPE = [
  { kode: 'PHC', nama: 'Perawat Homecare', warna: '#0ea5e9' },
  { kode: 'CG', nama: 'Caregiver (HC)', warna: '#7c3aed' },
  { kode: 'BS', nama: 'Baby Sitter', warna: '#ec4899' },
] as const;
const FILTER = [
  { key: 'total', label: 'Semua' },
  { key: 'training', label: 'On Training' },
  { key: 'available', label: 'Available' },
  { key: 'on_job', label: 'On Job' },
] as const;
type Filter = typeof FILTER[number]['key'];

function Kartu({ kode, nama, warna, data }: { kode: string; nama: string; warna: string; data: any }) {
  const [f, setF] = useState<Filter>('total');
  return (
    <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '18px', padding: '16px', boxShadow: 'var(--shadow)', borderTop: `3px solid ${warna}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 700, color: warna }}>{kode}</p>
          <p style={{ fontSize: '12px', color: 'var(--text3)' }}>{nama}</p>
        </div>
        <p style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{data?.[f] ?? 0}</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
        {FILTER.map(x => (
          <button key={x.key} onClick={() => setF(x.key)}
            style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${f === x.key ? warna : 'var(--border)'}`, background: f === x.key ? `${warna}22` : 'transparent',
              color: f === x.key ? warna : 'var(--text3)' }}>
            {x.label} <span style={{ opacity: 0.75 }}>{data?.[x.key] ?? 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MitraPerTipeCards({ data }: { data: any }) {
  return (
    <div>
      <h2 style={{ fontWeight: 700, color: 'var(--text)', fontSize: '14px', marginBottom: '10px' }}>Mitra per Tipe</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {TIPE.map(t => <Kartu key={t.kode} {...t} data={data?.[t.kode]} />)}
      </div>
    </div>
  );
}
