'use client';
import { useState } from 'react';

const GREEN = '#0e92b3';
const PINK = '#9c488b';

/** Form permintaan hapus akun -> pesan terisi otomatis ke WhatsApp / email resmi MGM. */
export default function FormHapusAkun({ wa, email }: { wa: string; email: string }) {
  const [f, setF] = useState({ nama: '', apps: 'Mikala Klien', kontak: '', alasan: '' });
  const [err, setErr] = useState('');
  const set = (k: keyof typeof f, v: string) => setF(p => ({ ...p, [k]: v }));

  const pesan = () =>
    `Permintaan Hapus Akun\n\nNama: ${f.nama.trim()}\nAplikasi: ${f.apps}\nNo HP / email terdaftar: ${f.kontak.trim()}` +
    (f.alasan.trim() ? `\nAlasan: ${f.alasan.trim()}` : '') +
    `\n\nSaya meminta akun dan data pribadi saya di aplikasi tersebut dihapus.`;

  const kirim = (via: 'wa' | 'email') => {
    if (!f.nama.trim() || !f.kontak.trim()) { setErr('Nama dan No HP / email terdaftar wajib diisi.'); return; }
    setErr('');
    if (via === 'wa') window.open(`https://wa.me/${wa}?text=${encodeURIComponent(pesan())}`, '_blank');
    else window.location.href = `mailto:${email}?subject=${encodeURIComponent('Permintaan Hapus Akun - ' + f.apps)}&body=${encodeURIComponent(pesan())}`;
  };

  const inp = { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', background: 'white' };
  const lbl = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', margin: '0 0 6px' };

  return (
    <div style={{ background: '#f4fafb', border: '1px solid #d6eef3', borderRadius: '18px', padding: 'clamp(16px,3.5vw,24px)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={lbl} htmlFor="ha-nama">Nama lengkap *</label>
        <input id="ha-nama" style={inp} value={f.nama} onChange={e => set('nama', e.target.value)} autoComplete="name" />
      </div>
      <div>
        <label style={lbl} htmlFor="ha-apps">Aplikasi *</label>
        <select id="ha-apps" style={inp} value={f.apps} onChange={e => set('apps', e.target.value)}>
          <option>Mikala Klien</option>
          <option>Mikala Mitra</option>
        </select>
      </div>
      <div>
        <label style={lbl} htmlFor="ha-kontak">No HP / email yang terdaftar di akun *</label>
        <input id="ha-kontak" style={inp} value={f.kontak} onChange={e => set('kontak', e.target.value)} placeholder="Contoh: 081234567890" />
      </div>
      <div>
        <label style={lbl} htmlFor="ha-alasan">Alasan (opsional)</label>
        <textarea id="ha-alasan" style={{ ...inp, minHeight: '80px', resize: 'vertical' }} value={f.alasan} onChange={e => set('alasan', e.target.value)} />
      </div>
      {err && <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>{err}</p>}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => kirim('wa')} style={{ flex: '1 1 200px', padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '15px', color: 'white', background: `linear-gradient(135deg, ${GREEN}, ${PINK})` }}>
          Kirim via WhatsApp
        </button>
        <button type="button" onClick={() => kirim('email')} style={{ flex: '1 1 200px', padding: '13px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '15px', color: GREEN, background: 'white', border: `1.5px solid ${GREEN}` }}>
          Kirim via Email
        </button>
      </div>
    </div>
  );
}
