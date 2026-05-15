'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ArrowLeft } from 'lucide-react';

export default function TambahLayananPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pasienList, setPasienList] = useState([]);
  const [form, setForm] = useState({
    service_type: 'Perawat Homecare',
    pasien_id: '',
    tanggal_mulai: '',
    catatan: '',
  });

  const inputStyle = { width:'100%', padding:'10px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text)', fontSize:'14px', outline:'none' };
  const labelStyle = { color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' };

  useEffect(() => {
    apiClient.get('/klien/pasien')
      .then((r) => setPasienList(Array.isArray(r.data?.data) ? r.data.data : []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pasien_id) { setError('Pilih pasien terlebih dahulu'); return; }
    setSaving(true);
    setError('');
    try {
      await apiClient.post('/klien/layanan', form);
      router.push('/layanan');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat permintaan layanan');
    } finally { setSaving(false); }
  };

  const tipeLayanan = ['Perawat Homecare','Perawat Lansia / Caregiver','Babysitter','Babysitter New Born Care','Perawat Jiwa','Caregiver / Kaigo (Jepang)'];

  return (
    <div style={{ padding:'16px', paddingBottom:'80px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', paddingTop:'8px' }}>
        <button onClick={() => router.back()} style={{ width:'36px', height:'36px', borderRadius:'12px', background:'var(--glass)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Minta Layanan</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Ajukan permintaan layanan baru</p>
        </div>
      </div>

      {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', padding:'12px', color:'#ef4444', fontSize:'13px', marginBottom:'16px' }}>{error}</div>}

      {pasienList.length === 0 && (
        <div style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'12px', padding:'12px', color:'#f59e0b', fontSize:'13px', marginBottom:'16px' }}>
          Belum ada pasien terdaftar. Tambah pasien dulu di menu Pasien.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
        <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'20px', display:'flex', flexDirection:'column', gap:'14px' }}>
          <div>
            <label style={labelStyle}>Tipe Layanan *</label>
            <select required value={form.service_type} onChange={e => setForm(p => ({...p, service_type: e.target.value}))} style={inputStyle}>
              {tipeLayanan.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Untuk Pasien *</label>
            <select required value={form.pasien_id} onChange={e => setForm(p => ({...p, pasien_id: e.target.value}))} style={inputStyle}>
              <option value="">-- Pilih Pasien --</option>
              {pasienList.map((p) => (
                <option key={p.id} value={p.id}>{p.nama_lengkap}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Tanggal Mulai *</label>
            <input required type="date" value={form.tanggal_mulai} onChange={e => setForm(p => ({...p, tanggal_mulai: e.target.value}))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Catatan / Kebutuhan Khusus</label>
            <textarea value={form.catatan} onChange={e => setForm(p => ({...p, catatan: e.target.value}))} style={{...inputStyle, minHeight:'80px', resize:'vertical'}} placeholder="Kebutuhan khusus, jadwal, dll" />
          </div>
        </div>
        <button type="submit" disabled={saving || pasienList.length === 0} style={{ width:'100%', padding:'14px', background: pasienList.length === 0 ? 'var(--glass)' : 'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'16px', color: pasienList.length === 0 ? 'var(--text3)' : 'white', fontWeight:700, fontSize:'15px', cursor: saving || pasienList.length === 0 ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Mengirim...' : 'Ajukan Layanan'}
        </button>
      </form>
    </div>
  );
}
