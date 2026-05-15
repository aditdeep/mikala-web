'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ArrowLeft } from 'lucide-react';

export default function TambahPasienPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nama_lengkap: '', tanggal_lahir: '', jenis_kelamin: 'L',
    alamat: '', diagnosa: '', catatan: '', hubungan: 'keluarga',
  });

  const inputStyle = { width:'100%', padding:'10px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text)', fontSize:'14px', outline:'none' };
  const labelStyle = { color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiClient.post('/klien/pasien', form);
      router.push('/pasien');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan pasien');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ padding:'16px', paddingBottom:'80px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', paddingTop:'8px' }}>
        <button onClick={() => router.back()} style={{ width:'36px', height:'36px', borderRadius:'12px', background:'var(--glass)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Tambah Pasien</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Data pasien yang akan dirawat</p>
        </div>
      </div>

      {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', padding:'12px', color:'#ef4444', fontSize:'13px', marginBottom:'16px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
        <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'20px', display:'flex', flexDirection:'column', gap:'14px' }}>
          <div>
            <label style={labelStyle}>Nama Lengkap Pasien *</label>
            <input required value={form.nama_lengkap} onChange={e => setForm(p => ({...p, nama_lengkap: e.target.value}))} style={inputStyle} placeholder="Nama lengkap pasien" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={labelStyle}>Tanggal Lahir *</label>
              <input required type="date" value={form.tanggal_lahir} onChange={e => setForm(p => ({...p, tanggal_lahir: e.target.value}))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Jenis Kelamin</label>
              <select value={form.jenis_kelamin} onChange={e => setForm(p => ({...p, jenis_kelamin: e.target.value}))} style={inputStyle}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Hubungan dengan Klien</label>
            <select value={form.hubungan} onChange={e => setForm(p => ({...p, hubungan: e.target.value}))} style={inputStyle}>
              <option value="diri_sendiri">Diri Sendiri</option>
              <option value="keluarga">Keluarga</option>
              <option value="orang_tua">Orang Tua</option>
              <option value="pasangan">Pasangan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Alamat</label>
            <input value={form.alamat} onChange={e => setForm(p => ({...p, alamat: e.target.value}))} style={inputStyle} placeholder="Alamat pasien" />
          </div>
          <div>
            <label style={labelStyle}>Diagnosa / Kondisi</label>
            <input value={form.diagnosa} onChange={e => setForm(p => ({...p, diagnosa: e.target.value}))} style={inputStyle} placeholder="cth: Alzheimer, Bedrest, Pasca operasi" />
          </div>
          <div>
            <label style={labelStyle}>Catatan Tambahan</label>
            <textarea value={form.catatan} onChange={e => setForm(p => ({...p, catatan: e.target.value}))} style={{...inputStyle, minHeight:'80px', resize:'vertical'}} placeholder="Kebutuhan khusus, alergi, dll" />
          </div>
        </div>
        <button type="submit" disabled={saving} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'16px', color:'white', fontWeight:700, fontSize:'15px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Menyimpan...' : 'Simpan Pasien'}
        </button>
      </form>
    </div>
  );
}
