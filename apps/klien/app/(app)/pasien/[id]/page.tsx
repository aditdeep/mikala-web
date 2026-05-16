'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ArrowLeft, User, Phone, MapPin, Heart, AlertCircle, FileText, Edit2, Save, X } from 'lucide-react';

export default function DetailPasienPage() {
  const params = useParams();
  const router = useRouter();
  const [pasien, setPasien] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState('');

  const fetchPasien = () => {
    apiClient.get('/klien/pasien')
      .then((r: any) => {
        const d = r.data?.data;
        const list = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
        const found = list.find((p: any) => String(p.id) === String(params.id));
        setPasien(found || null);
        if (found) setForm({
          golongan_darah: found.golongan_darah || '',
          riwayat_penyakit: found.riwayat_penyakit || '',
          alergi: found.alergi || '',
          obat_rutin: found.obat_rutin || '',
          catatan_khusus: found.catatan_khusus || '',
          kontak_darurat_nama: found.kontak_darurat_nama || '',
          kontak_darurat_phone: found.kontak_darurat_phone || '',
          kontak_darurat_relasi: found.kontak_darurat_relasi || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchPasien(); }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await apiClient.patch(\`/klien/pasien/\${params.id}\`, form);
      await fetchPasien();
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'400px' }}><p style={{ color:'var(--text3)' }}>Memuat data...</p></div>;
  if (!pasien) return <div style={{ textAlign:'center', padding:'40px' }}><p style={{ color:'var(--text3)' }}>Data tidak ditemukan</p><button onClick={() => router.back()} style={{ marginTop:'16px', padding:'8px 16px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text2)', cursor:'pointer' }}>Kembali</button></div>;

  const usia = pasien.tanggal_lahir ? new Date().getFullYear() - new Date(pasien.tanggal_lahir).getFullYear() : null;
  const tglLahir = pasien.tanggal_lahir ? new Date(pasien.tanggal_lahir).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '-';
  const inputStyle = { width:'100%', padding:'8px 10px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', outline:'none' };

  return (
    <div style={{ padding:'16px', paddingBottom:'80px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px', paddingTop:'8px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.back()} style={{ width:'36px', height:'36px', borderRadius:'12px', background:'var(--glass)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)' }}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Detail Pasien</h1>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'12px', color:'#10b981', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
            <Edit2 size={14} />Edit
          </button>
        ) : (
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => setEditing(false)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontSize:'13px', cursor:'pointer' }}>
              <X size={14} />Batal
            </button>
            <button onClick={handleSave} disabled={saving} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 12px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'12px', color:'white', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
              <Save size={14} />{saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        )}
      </div>

      {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', padding:'10px 14px', color:'#ef4444', fontSize:'13px', marginBottom:'12px' }}>{error}</div>}

      <div style={{ background:'linear-gradient(135deg, #10b981, #059669)', borderRadius:'20px', padding:'24px', textAlign:'center', marginBottom:'16px', boxShadow:'0 8px 24px rgba(16,185,129,0.4)' }}>
        <div style={{ width:'64px', height:'64px', borderRadius:'20px', margin:'0 auto 12px', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', fontWeight:700, color:'white' }}>
          {pasien.nama_lengkap?.[0]?.toUpperCase() || 'P'}
        </div>
        <h2 style={{ color:'white', fontWeight:700, fontSize:'18px' }}>{pasien.nama_lengkap}</h2>
        <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'13px', marginTop:'4px' }}>
          {pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} {usia ? \`• \${usia} tahun\` : ''}
        </p>
        {pasien.golongan_darah && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'10px', background:'rgba(255,255,255,0.2)', borderRadius:'10px', padding:'4px 12px' }}>
            <span style={{ color:'white', fontSize:'12px', fontWeight:600 }}>Gol. Darah: {pasien.golongan_darah}</span>
          </div>
        )}
      </div>

      {/* Data Pribadi - read only */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', marginBottom:'12px' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Data Pribadi</p>
        </div>
        {[
          { icon: User, label:'Nama Lengkap', value: pasien.nama_lengkap },
          { icon: User, label:'Tanggal Lahir', value: tglLahir },
          { icon: User, label:'Jenis Kelamin', value: pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' },
          { icon: MapPin, label:'Alamat', value: pasien.alamat },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={{ display:'flex', gap:'12px', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(16,185,129,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={15} style={{ color:'#10b981' }} />
              </div>
              <div><p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p><p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{item.value || '-'}</p></div>
            </div>
          );
        })}
        {/* Golongan Darah - editable */}
        <div style={{ display:'flex', gap:'12px', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(16,185,129,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Heart size={15} style={{ color:'#10b981' }} />
          </div>
          <div style={{ flex:1 }}>
            <p style={{ color:'var(--text3)', fontSize:'11px' }}>Golongan Darah</p>
            {editing ? (
              <select value={form.golongan_darah} onChange={e => setForm((p: any) => ({...p, golongan_darah: e.target.value}))} style={inputStyle}>
                <option value="">- Pilih -</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            ) : (
              <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{pasien.golongan_darah || '-'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Riwayat Medis - editable */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', marginBottom:'12px' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Riwayat Medis</p>
        </div>
        {[
          { key:'riwayat_penyakit', icon: Heart, label:'Riwayat Penyakit', multiline: true },
          { key:'alergi', icon: AlertCircle, label:'Alergi', multiline: false },
          { key:'obat_rutin', icon: FileText, label:'Obat Rutin', multiline: false },
          { key:'catatan_khusus', icon: FileText, label:'Catatan Khusus', multiline: true },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.key} style={{ display:'flex', gap:'12px', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={15} style={{ color:'#ef4444' }} />
              </div>
              <div style={{ flex:1 }}>
                <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                {editing ? (
                  item.multiline
                    ? <textarea value={form[item.key]} onChange={e => setForm((p: any) => ({...p, [item.key]: e.target.value}))} style={{...inputStyle, minHeight:'60px', resize:'vertical'}} />
                    : <input value={form[item.key]} onChange={e => setForm((p: any) => ({...p, [item.key]: e.target.value}))} style={inputStyle} />
                ) : (
                  <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{pasien[item.key] || '-'}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Kontak Darurat - editable */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Kontak Darurat</p>
        </div>
        {[
          { key:'kontak_darurat_nama', icon: User, label:'Nama' },
          { key:'kontak_darurat_phone', icon: Phone, label:'Nomor HP' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.key} style={{ display:'flex', gap:'12px', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(59,130,246,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={15} style={{ color:'#3b82f6' }} />
              </div>
              <div style={{ flex:1 }}>
                <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                {editing ? (
                  <input value={form[item.key]} onChange={e => setForm((p: any) => ({...p, [item.key]: e.target.value}))} style={inputStyle} />
                ) : (
                  <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{pasien[item.key] || '-'}</p>
                )}
              </div>
            </div>
          );
        })}
        <div style={{ display:'flex', gap:'12px', padding:'12px 16px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(59,130,246,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <User size={15} style={{ color:'#3b82f6' }} />
          </div>
          <div style={{ flex:1 }}>
            <p style={{ color:'var(--text3)', fontSize:'11px' }}>Relasi</p>
            {editing ? (
              <select value={form.kontak_darurat_relasi} onChange={e => setForm((p: any) => ({...p, kontak_darurat_relasi: e.target.value}))} style={inputStyle}>
                <option value="keluarga">Keluarga</option>
                <option value="suami_istri">Suami/Istri</option>
                <option value="anak">Anak</option>
                <option value="orang_tua">Orang Tua</option>
                <option value="lainnya">Lainnya</option>
              </select>
            ) : (
              <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{pasien.kontak_darurat_relasi || '-'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
