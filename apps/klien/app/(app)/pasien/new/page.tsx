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
    golongan_darah: '', alamat: '', riwayat_penyakit: '',
    alergi: '', obat_rutin: '', catatan_khusus: '',
    kontak_darurat_nama: '', kontak_darurat_phone: '', kontak_darurat_relasi: 'keluarga',
  });

  const inputStyle = { width:'100%', padding:'10px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text)', fontSize:'14px', outline:'none' };
  const labelStyle = { color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' };

  const set = (k: string, v: string) => setForm(p => ({...p, [k]: v}));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiClient.post('/klien/pasien', form);
      router.push('/pasien');
    } catch (err: any) {
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
          <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', margin:0 }}>Data Pasien</p>

          <div>
            <label style={labelStyle}>Nama Lengkap *</label>
            <input required value={form.nama_lengkap} onChange={e => set('nama_lengkap', e.target.value)} style={inputStyle} placeholder="Nama lengkap pasien" />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={labelStyle}>Tanggal Lahir *</label>
              <input required type="date" value={form.tanggal_lahir} onChange={e => set('tanggal_lahir', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Jenis Kelamin *</label>
              <select required value={form.jenis_kelamin} onChange={e => set('jenis_kelamin', e.target.value)} style={inputStyle}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={labelStyle}>Golongan Darah</label>
              <select value={form.golongan_darah} onChange={e => set('golongan_darah', e.target.value)} style={inputStyle}>
                <option value="">- Pilih -</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>NIK</label>
              <input value={(form as any).nik || ''} onChange={e => set('nik', e.target.value)} style={inputStyle} placeholder="16 digit NIK" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Alamat *</label>
            <input required value={form.alamat} onChange={e => set('alamat', e.target.value)} style={inputStyle} placeholder="Alamat lengkap pasien" />
          </div>
          <div>
            <label style={labelStyle}>Riwayat Penyakit</label>
            <textarea value={form.riwayat_penyakit} onChange={e => set('riwayat_penyakit', e.target.value)} style={{...inputStyle, minHeight:'60px', resize:'vertical'}} placeholder="Penyakit yang pernah diderita" />
          </div>
          <div>
            <label style={labelStyle}>Alergi</label>
            <input value={form.alergi} onChange={e => set('alergi', e.target.value)} style={inputStyle} placeholder="Alergi obat, makanan, dll" />
          </div>
          <div>
            <label style={labelStyle}>Obat Rutin</label>
            <input value={form.obat_rutin} onChange={e => set('obat_rutin', e.target.value)} style={inputStyle} placeholder="Obat yang rutin dikonsumsi" />
          </div>
          <div>
            <label style={labelStyle}>Catatan Khusus</label>
            <textarea value={form.catatan_khusus} onChange={e => set('catatan_khusus', e.target.value)} style={{...inputStyle, minHeight:'60px', resize:'vertical'}} placeholder="Kebutuhan khusus lainnya" />
          </div>
        </div>

        <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'20px', display:'flex', flexDirection:'column', gap:'14px' }}>
          <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', margin:0 }}>Kontak Darurat</p>
          <div>
            <label style={labelStyle}>Nama Kontak Darurat</label>
            <input value={form.kontak_darurat_nama} onChange={e => set('kontak_darurat_nama', e.target.value)} style={inputStyle} placeholder="Nama keluarga/wali" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={labelStyle}>Nomor HP</label>
              <input value={form.kontak_darurat_phone} onChange={e => set('kontak_darurat_phone', e.target.value)} style={inputStyle} placeholder="08xxxxxxxxxx" />
            </div>
            <div>
              <label style={labelStyle}>Relasi</label>
              <select value={form.kontak_darurat_relasi} onChange={e => set('kontak_darurat_relasi', e.target.value)} style={inputStyle}>
                <option value="keluarga">Keluarga</option>
                <option value="suami_istri">Suami/Istri</option>
                <option value="anak">Anak</option>
                <option value="orang_tua">Orang Tua</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'16px', color:'white', fontWeight:700, fontSize:'15px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Menyimpan...' : 'Simpan Pasien'}
        </button>
      </form>
    </div>
  );
}
