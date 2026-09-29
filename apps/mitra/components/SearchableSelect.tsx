'use client';
import { useEffect, useRef, useState } from 'react';

// Dropdown pilihan yang bisa di-search -- dipakai buat ganti <select> polos yang isinya
// panjang (misal Lembaga atau daftar Nama Mitra ratusan baris), biar user gak perlu scroll
// panjang buat cari satu nama. Ketik minimal 1 huruf, hasil difilter dari `options`.
export interface SearchableSelectOption {
  value: string | number;
  label: string;
}

interface Props {
  options: SearchableSelectOption[];
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  disabled?: boolean;
}

export default function SearchableSelect({
  options, value, onChange,
  placeholder = '-- Pilih --',
  searchPlaceholder = 'Ketik untuk mencari...',
  loading = false,
  loadingText = 'Memuat...',
  emptyText = 'Tidak ditemukan',
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const selected = options.find(o => String(o.value) === String(value));
  const filtered = search.trim()
    ? options.filter(o => o.label.toLowerCase().includes(search.trim().toLowerCase()))
    : options;

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px', color: 'white',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
  };

  if (loading) {
    return <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{loadingText}</p>;
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {selected ? (
        <div style={{ ...inp, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600 }}>{selected.label}</span>
          {!disabled && (
            <button type="button" onClick={() => { onChange(undefined); setSearch(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '16px', lineHeight: 1, padding: 0 }}>
              ×
            </button>
          )}
        </div>
      ) : (
        <>
          <input
            value={search}
            disabled={disabled}
            onFocus={() => setOpen(true)}
            onChange={e => { setSearch(e.target.value); setOpen(true); }}
            style={inp}
            placeholder={options.length === 0 ? emptyText : (searchPlaceholder || placeholder)}
          />
          {open && options.length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 20,
              maxHeight: '220px', overflowY: 'auto',
              background: '#1a1030', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '12px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{emptyText}</div>
              ) : filtered.slice(0, 50).map(o => (
                <div key={o.value}
                  onMouseDown={() => { onChange(o.value); setSearch(''); setOpen(false); }}
                  style={{ padding: '10px 14px', fontSize: '13px', color: 'white', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {o.label}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
