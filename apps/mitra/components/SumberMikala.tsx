'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';

interface Props {
  value: { tipe: string; detail: string; lembaga_id?: number; referrer_mitra_id?: number };
  onChange: (v: { tipe: string; detail: string; lembaga_id?: number; referrer_mitra_id?: number }) => void;
  dark?: boolean;
}

const SENDIRI_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook',  label: 'Facebook' },
  { value: 'website',   label: 'Website Mikala' },
  { value: 'tiktok',    label: 'TikTok' },
  { value: 'youtube',   label: 'YouTube' },
  { value: 'lainnya',   label: 'Lainnya' },
];

export function SumberMikala({ value, onChange, dark = true }: Props) {
  const [lembagaList, setLembagaList] = useState<any[]>([]);
  const [mitraList, setMitraList]     = useState<any[]>([]);
  const [loadingL, setLoadingL] = useState(false);
  const [loadingM, setLoadingM] = useState(false);

  useEffect(() => {
    if (value.tipe === 'lembaga' && lembagaList.length === 0) {
      setLoadingL(true);
      apiClient.get('/public/lembaga')
        .then((r: any) => setLembagaList(r.data?.data || []))
        .catch(() => {})
        .finally(() => setLoadingL(false));
    }
    if (value.tipe === 'orang_terdekat' && mitraList.length === 0) {
      setLoadingM(true);
      apiClient.get('/public/mitra-list')
        .then((r: any) => setMitraList(r.data?.data || []))
        .catch(() => {})
        .finally(() => setLoadingM(false));
    }
  }, [value.tipe]);

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '10px', fontSize: '13px',
    outline: 'none', boxSizing: 'border-box' as const,
    background: dark ? 'rgba(255,255,255,0.07)' : 'var(--bg)',
    border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid var(--border)',
    color: dark ? 'white' : 'var(--text)',
  };

  const lbl: React.CSSProperties = {
    fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '5px',
    color: dark ? 'rgba(255,255,255,0.6)' : 'var(--text2)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Pilih tipe sumber */}
      <div>
        <label style={lbl}>Tahu Mikala dari *</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            { v: 'sendiri',       emoji: '🔍', label: 'Sendiri' },
            { v: 'lembaga',       emoji: '🏫', label: 'Lembaga' },
            { v: 'orang_terdekat',emoji: '👥', label: 'Orang Terdekat' },
          ].map(opt => (
            <button key={opt.v} type="button"
              onClick={() => onChange({ tipe: opt.v, detail: '', lembaga_id: undefined, referrer_mitra_id: undefined })}
              style={{
                padding: '10px 8px', borderRadius: '10px', cursor: 'pointer',
                textAlign: 'center' as const, fontSize: '12px', fontWeight: 600,
                border: `2px solid ${value.tipe === opt.v
                  ? (dark ? 'rgba(167,139,250,0.8)' : '#7c3aed')
                  : (dark ? 'rgba(255,255,255,0.15)' : 'var(--border)')}`,
                background: value.tipe === opt.v
                  ? (dark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.08)')
                  : 'transparent',
                color: value.tipe === opt.v
                  ? (dark ? '#c4b5fd' : '#7c3aed')
                  : (dark ? 'rgba(255,255,255,0.5)' : 'var(--text3)'),
              }}>
              <div style={{ fontSize: '18px', marginBottom: '2px' }}>{opt.emoji}</div>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* SENDIRI — pilih platform */}
      {value.tipe === 'sendiri' && (
        <div>
          <label style={lbl}>Platform</label>
          <select value={value.detail} onChange={e => onChange({ ...value, detail: e.target.value })} style={inp}>
            <option value="">-- Pilih platform --</option>
            {SENDIRI_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}

      {/* LEMBAGA — pilih dari list */}
      {value.tipe === 'lembaga' && (
        <div>
          <label style={lbl}>Nama Lembaga</label>
          {loadingL ? (
            <p style={{ fontSize: '12px', color: dark ? 'rgba(255,255,255,0.4)' : 'var(--text3)' }}>Memuat daftar lembaga...</p>
          ) : (
            <select
              value={value.lembaga_id || ''}
              onChange={e => onChange({ ...value, lembaga_id: Number(e.target.value), detail: lembagaList.find(l => l.id === Number(e.target.value))?.nama || '' })}
              style={inp}>
              <option value="">-- Pilih lembaga --</option>
              {lembagaList.map((l: any) => (
                <option key={l.id} value={l.id}>{l.nama} {l.kota ? `(${l.kota})` : ''}</option>
              ))}
            </select>
          )}
          {lembagaList.length === 0 && !loadingL && (
            <p style={{ fontSize: '11px', color: dark ? 'rgba(255,255,255,0.35)' : 'var(--text3)', marginTop: '4px' }}>
              Belum ada lembaga terdaftar. Hubungi Divisi Rekrutmen.
            </p>
          )}
        </div>
      )}

      {/* ORANG TERDEKAT — pilih mitra */}
      {value.tipe === 'orang_terdekat' && (
        <div>
          <label style={lbl}>Nama Mitra yang Mereferensikan</label>
          {loadingM ? (
            <p style={{ fontSize: '12px', color: dark ? 'rgba(255,255,255,0.4)' : 'var(--text3)' }}>Memuat daftar mitra...</p>
          ) : (
            <select
              value={value.referrer_mitra_id || ''}
              onChange={e => onChange({ ...value, referrer_mitra_id: Number(e.target.value), detail: mitraList.find(m => m.id === Number(e.target.value))?.nama_lengkap || '' })}
              style={inp}>
              <option value="">-- Pilih nama mitra --</option>
              {mitraList.map((m: any) => (
                <option key={m.id} value={m.id}>{m.nama_lengkap} {m.kota ? `- ${m.kota}` : ''}</option>
              ))}
            </select>
          )}
          <p style={{ fontSize: '11px', color: dark ? 'rgba(255,255,255,0.35)' : 'var(--text3)', marginTop: '4px' }}>
            Mitra yang mereferensikan akan mendapat fee setelah Anda diterima.
          </p>
        </div>
      )}
    </div>
  );
}
