'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { Users, Plus, Search, X, Eye, CheckCircle, XCircle, Clock, Pencil, Trash2, FileText } from 'lucide-react';

const PENDIDIKAN = ['SMA Negeri / Swasta','MA, MAN, atau Sekolah Keagamaan Lainnya','SMK / Sekolah Kejuruan Kesehatan','SMK / Sekolah Kejuruan Lainnya','Diploma D1/D2/D3 Kesehatan','Diploma D1/D2/D3 Lainnya','Sarjana S1 Kesehatan','Sarjana S1 Keperawatan','Profesi Nurse','Sarjana S1 Lainnya'];
const TIPE_PEKERJAAN = ['Perawat Homecare','Perawat Lansia / Caregiver','Babysitter','Babysitter New Born Care','Perawat Jiwa','Caregiver / Kaigo (Jepang)','Ke Jepang Lainnya'];
const AGAMA = ['Islam','Kristen Protestan','Kristen Katolik','Hindu','Budha','Konghucu'];
const HEWAN = ['Tidak takut semua hewan','Anjing','Kucing','Yang lain'];

const inputStyle = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };
const labelStyle: React.CSSProperties = { color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' };
const sectionStyle: React.CSSProperties = { background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'14px', padding:'16px', marginBottom:'12px' };

const emptyForm = {
  name:'', email:'', password:'', phone:'', nik:'', usia:'',
  tempat_lahir:'', tanggal_lahir:'', alamat:'', kelurahan:'', kecamatan:'',
  kota:'', provinsi:'', suku:'', pendidikan:'', jenis_kelamin:'L',
  tinggi:'', berat:'', vaksin:'', status_nikah:'Belum Menikah',
  agama:'Islam', takut_hewan:'Tidak takut semua hewan',
  bisa_memasak:'3', tipe_pekerjaan:'Perawat Homecare',
  pengalaman_pelatihan:'', pengalaman:'',
};

export default function RekrutmenPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<any>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('semua');
  const [errorMsg, setErrorMsg] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any>(null);
  const [showKredensial, setShowKredensial] = useState<any>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    apiClient.get('/internal/rekrutmen/mitra')
      .then((res: any) => { setData(Array.isArray(res.data?.data) ? res.data.data : []); setLoading(false); })
      .catch(() => { setData([]); setLoading(false); });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password || 'password123',
        phone: form.phone,
        nik: form.nik,
        alamat: `${form.alamat}, ${form.kelurahan}, ${form.kecamatan}, ${form.kota}, ${form.provinsi}`,
        kota: form.kota,
        provinsi: form.provinsi,
        tanggal_lahir: form.tanggal_lahir,
        jenis_kelamin: form.jenis_kelamin,
        pendidikan: form.pendidikan,
        pengalaman: `PELATIHAN: ${form.pengalaman_pelatihan}\n\nPENGALAMAN KERJA: ${form.pengalaman}\n\nDATA TAMBAHAN: Usia: ${form.usia}, Tempat Lahir: ${form.tempat_lahir}, TB: ${form.tinggi}cm, BB: ${form.berat}kg, Vaksin: ${form.vaksin}, Agama: ${form.agama}, Status Nikah: ${form.status_nikah}, Takut Hewan: ${form.takut_hewan}, Memasak: ${form.bisa_memasak}/5, Tipe Pekerjaan: ${form.tipe_pekerjaan}, Suku: ${form.suku}`,
      };

      if (editItem) {
        await apiClient.patch(`/internal/rekrutmen/mitra/${editItem.id}`, payload);
      } else {
        await apiClient.post('/internal/rekrutmen/mitra', payload);
      }
      setShowModal(false);
      setEditItem(null);
      if (!editItem) {
        setShowKredensial({ email: form.email, password: form.password || 'password123', name: form.name });
      }
      setForm({ ...emptyForm });
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal menyimpan data');
    } finally { setSaving(false); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    // Pre-fill form dari data yang ada
    const user = item.user || {};
    setForm({
      ...emptyForm,
      name: item.nama_lengkap || user.name || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      nik: item.nik || '',
      pendidikan: item.pendidikan_terakhir || '',
      kota: item.kota || '',
      provinsi: item.provinsi || '',
      alamat: item.alamat || '',
      tanggal_lahir: item.tanggal_lahir?.split('T')[0] || '',
      jenis_kelamin: item.jenis_kelamin || 'L',
      pengalaman: item.pengalaman || '',
      pengalaman_pelatihan: '',
    });
    setShowModal(true);
    setErrorMsg('');
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/internal/rekrutmen/mitra/${id}`);
      setShowDeleteConfirm(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus data');
    }
  };

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const filtered = data.filter((d: any) => {
    const matchTab = activeTab === 'semua' || d.status === activeTab;
    return matchTab && JSON.stringify(d).toLowerCase().includes(search.toLowerCase());
  });

  const counts = {
    semua: data.length,
    training: data.filter((d: any) => d.status === 'training').length,
    available: data.filter((d: any) => d.status === 'available').length,
    on_job: data.filter((d: any) => d.status === 'on_job').length,
  };

  const statusBadge = (s: string) => {
    const map: any = {
      training: { color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)', label:'Training', icon: Clock },
      available: { color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)', label:'Tersedia', icon: CheckCircle },
      on_job: { color:'#3b82f6', bg:'rgba(59,130,246,0.15)', border:'rgba(59,130,246,0.3)', label:'On Job', icon: CheckCircle },
      inactive: { color:'#ef4444', bg:'rgba(239,68,68,0.15)', border:'rgba(239,68,68,0.3)', label:'Nonaktif', icon: XCircle },
      re_training: { color:'#8b5cf6', bg:'rgba(139,92,246,0.15)', border:'rgba(139,92,246,0.3)', label:'Re-Training', icon: Clock },
    };
    return map[s] || map.training;
  };

  return (
    <div className="space-y-5">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Rekrutmen Mitra</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>{data.length} total pelamar terdaftar</p>
        </div>
        <button onClick={() => { setShowModal(true); setEditItem(null); setForm({...emptyForm}); setErrorMsg(''); }} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer', boxShadow:'0 4px 12px rgba(124,58,237,0.35)' }}>
          <Plus size={15} />Tambah Pelamar
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {(['semua','training','available','on_job'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding:'6px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:600, cursor:'pointer',
            background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'var(--glass)',
            color: activeTab === tab ? 'white' : 'var(--text2)',
            border: activeTab === tab ? 'none' : '1px solid var(--border)',
          }}>
            {tab === 'semua' ? 'Semua' : tab === 'training' ? 'Training' : tab === 'available' ? 'Tersedia' : 'On Job'} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(16px)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
        <Search size={16} style={{ color:'var(--text3)', flexShrink:0 }} />
        <input placeholder="Cari nama, email, kota..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
      </div>

      {/* Table */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        {loading ? (
          <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
            {[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px' }} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Nama','Email','Pendidikan','Kota','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item: any, i: number) => {
                  const badge = statusBadge(item.status);
                  const Icon = badge.icon;
                  const user = item.user || item;
                  return (
                    <tr key={item.id || i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--purple-light)', fontSize:'13px', fontWeight:700, flexShrink:0 }}>
                            {(item.nama_lengkap || user.name)?.[0]?.toUpperCase() || 'M'}
                          </div>
                          <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{item.nama_lengkap || user.name || '-'}</p>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{user.email || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', maxWidth:'150px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.pendidikan_terakhir || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.kota || '-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:badge.bg, color:badge.color, border:`1px solid ${badge.border}`, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                          <Icon size={11} />{badge.label}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                          <button onClick={() => setShowDetail(item)} title="Detail" style={{ padding:'5px 8px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'8px', color:'var(--purple-light)', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', gap:'3px' }}>
                            <Eye size={13} />
                          </button>
                          <button onClick={() => handleEdit(item)} title="Edit" style={{ padding:'5px 8px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'8px', color:'#3b82f6', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', gap:'3px' }}>
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => router.push(`/rekrutmen/cv/${item.id}`)} title="CV" style={{ padding:'5px 8px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'8px', color:'#10b981', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', gap:'3px' }}>
                            <FileText size={13} />CV
                          </button>
                          <button onClick={() => setShowDeleteConfirm(item)} title="Hapus" style={{ padding:'5px 8px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', gap:'3px' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'48px 20px' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'20px', margin:'0 auto 14px', background:'rgba(124,58,237,0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Users size={28} style={{ color:'var(--purple-light)', opacity:0.5 }} />
            </div>
            <p style={{ fontWeight:600, color:'var(--text)' }}>Belum ada data pelamar</p>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'20px', padding:'24px', maxWidth:'360px', width:'100%', textAlign:'center' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'rgba(239,68,68,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Trash2 size={24} style={{ color:'#ef4444' }} />
            </div>
            <h3 style={{ fontSize:'16px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>Hapus Data Mitra?</h3>
            <p style={{ fontSize:'13px', color:'var(--text3)', marginBottom:'20px' }}>
              Data <strong>{showDeleteConfirm.nama_lengkap || showDeleteConfirm.user?.name}</strong> akan dinonaktifkan. Aksi ini tidak bisa dibatalkan.
            </p>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
              <button onClick={() => handleDelete(showDeleteConfirm.id)} style={{ flex:1, padding:'10px', background:'linear-gradient(135deg, #ef4444, #dc2626)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal (Add/Edit) */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, overflowY:'auto', padding:'20px' }} onClick={e => { if(e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'700px', padding:'24px', margin:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <div>
                <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)' }}>{editItem ? 'Edit Data Mitra' : 'Form Pendaftaran Mitra'}</h2>
                <p style={{ color:'var(--text3)', fontSize:'13px' }}>Isi data pelamar dengan lengkap dan benar</p>
              </div>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}>
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'12px', padding:'12px 16px', marginBottom:'16px', color:'#ef4444', fontSize:'13px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Akun */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>🔐 Data Akun</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={labelStyle}>Email {!editItem && '*'}</label>
                    <input required={!editItem} type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle} placeholder="email@contoh.com" disabled={!!editItem} />
                  </div>
                  {!editItem && (
                    <div>
                      <label style={labelStyle}>Password *</label>
                      <input required type="password" value={form.password} onChange={e => set('password', e.target.value)} style={inputStyle} placeholder="Min. 8 karakter" minLength={8} />
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>Nomor HP *</label>
                    <input required value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} placeholder="08xxxxxxxxxx" />
                  </div>
                </div>
              </div>

              {/* Data Pribadi */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>📋 Data Pribadi</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={labelStyle}>Nama Lengkap (sesuai KTP) *</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} placeholder="Nama lengkap" />
                  </div>
                  <div><label style={labelStyle}>NIK *</label><input required value={form.nik} onChange={e => set('nik', e.target.value)} style={inputStyle} placeholder="16 digit NIK" /></div>
                  <div><label style={labelStyle}>Usia *</label><input required type="number" value={form.usia} onChange={e => set('usia', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Tempat Lahir *</label><input required value={form.tempat_lahir} onChange={e => set('tempat_lahir', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Tanggal Lahir *</label><input required type="date" value={form.tanggal_lahir} onChange={e => set('tanggal_lahir', e.target.value)} style={inputStyle} /></div>
                  <div>
                    <label style={labelStyle}>Jenis Kelamin *</label>
                    <select value={form.jenis_kelamin} onChange={e => set('jenis_kelamin', e.target.value)} style={inputStyle}>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Status Pernikahan</label>
                    <select value={form.status_nikah} onChange={e => set('status_nikah', e.target.value)} style={inputStyle}>
                      <option>Menikah</option><option>Belum Menikah</option>
                    </select>
                  </div>
                  <div style={{ gridColumn:'1/-1' }}><label style={labelStyle}>Alamat sesuai KTP *</label><input required value={form.alamat} onChange={e => set('alamat', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Kelurahan</label><input value={form.kelurahan} onChange={e => set('kelurahan', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Kecamatan</label><input value={form.kecamatan} onChange={e => set('kecamatan', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Kota *</label><input required value={form.kota} onChange={e => set('kota', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Provinsi *</label><input required value={form.provinsi} onChange={e => set('provinsi', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Suku</label><input value={form.suku} onChange={e => set('suku', e.target.value)} style={inputStyle} placeholder="Opsional" /></div>
                  <div>
                    <label style={labelStyle}>Agama *</label>
                    <select value={form.agama} onChange={e => set('agama', e.target.value)} style={inputStyle}>
                      {AGAMA.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Fisik */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>💪 Data Fisik & Preferensi</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div><label style={labelStyle}>Tinggi Badan (CM) *</label><input required type="number" value={form.tinggi} onChange={e => set('tinggi', e.target.value)} style={inputStyle} placeholder="165" /></div>
                  <div><label style={labelStyle}>Berat Badan (KG) *</label><input required type="number" value={form.berat} onChange={e => set('berat', e.target.value)} style={inputStyle} placeholder="55" /></div>
                  <div><label style={labelStyle}>Vaksin *</label><input required value={form.vaksin} onChange={e => set('vaksin', e.target.value)} style={inputStyle} placeholder="Covid, Hepatitis" /></div>
                  <div>
                    <label style={labelStyle}>Takut Hewan *</label>
                    <select value={form.takut_hewan} onChange={e => set('takut_hewan', e.target.value)} style={inputStyle}>
                      {HEWAN.map(h => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Kemampuan Memasak (1-5) *</label>
                    <select value={form.bisa_memasak} onChange={e => set('bisa_memasak', e.target.value)} style={inputStyle}>
                      {[1,2,3,4,5].map(n => <option key={n} value={String(n)}>{n} - {n===1?'Tidak bisa':n===2?'Sedikit':n===3?'Cukup':n===4?'Mahir':'Sangat mahir'}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pendidikan & Pekerjaan */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>🎓 Pendidikan & Pekerjaan</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  <div>
                    <label style={labelStyle}>Pendidikan Terakhir *</label>
                    <select required value={form.pendidikan} onChange={e => set('pendidikan', e.target.value)} style={inputStyle}>
                      <option value="">-- Pilih pendidikan --</option>
                      {PENDIDIKAN.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Tipe Pekerjaan yang Dilamar *</label>
                    <select value={form.tipe_pekerjaan} onChange={e => set('tipe_pekerjaan', e.target.value)} style={inputStyle}>
                      {TIPE_PEKERJAAN.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pengalaman */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>💼 Pengalaman</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  <div>
                    <label style={labelStyle}>Pelatihan / Pendidikan non-formal *</label>
                    <textarea required value={form.pengalaman_pelatihan} onChange={e => set('pengalaman_pelatihan', e.target.value)} style={{ ...inputStyle, minHeight:'70px', resize:'vertical' as const }} placeholder="Sebutkan pelatihan, atau tulis 'Tidak ada'" />
                  </div>
                  <div>
                    <label style={labelStyle}>Pengalaman Kerja / Magang *</label>
                    <textarea required value={form.pengalaman} onChange={e => set('pengalaman', e.target.value)} style={{ ...inputStyle, minHeight:'70px', resize:'vertical' as const }} placeholder="Ceritakan pengalaman kerja, atau tulis 'Tidak ada'" />
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
                <button type="button" onClick={() => { setShowModal(false); setEditItem(null); }} style={{ padding:'10px 20px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={saving} style={{ padding:'10px 24px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Menyimpan...' : editItem ? 'Update Data' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'520px', padding:'24px', maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Detail Pelamar</h2>
              <div style={{ display:'flex', gap:'6px' }}>
                <button onClick={() => { setShowDetail(null); router.push(`/rekrutmen/cv/${showDetail.id}`); }} style={{ display:'flex', alignItems:'center', gap:'4px', padding:'7px 12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'10px', color:'#10b981', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                  <FileText size={14} />CV
                </button>
                <button onClick={() => setShowDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={18} /></button>
              </div>
            </div>
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              <div style={{ width:'60px', height:'60px', borderRadius:'18px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:'22px', fontWeight:700, color:'white' }}>
                {(showDetail.nama_lengkap || showDetail.user?.name)?.[0]?.toUpperCase() || 'M'}
              </div>
              <p style={{ fontWeight:700, fontSize:'16px', color:'var(--text)' }}>{showDetail.nama_lengkap || showDetail.user?.name}</p>
              <p style={{ color:'var(--text3)', fontSize:'13px' }}>{showDetail.user?.email}</p>
            </div>
            {[
              { label:'Telepon', val: showDetail.user?.phone },
              { label:'NIK', val: showDetail.nik },
              { label:'Tgl Lahir', val: showDetail.tanggal_lahir },
              { label:'Jenis Kelamin', val: showDetail.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' },
              { label:'Alamat', val: showDetail.alamat },
              { label:'Kota', val: showDetail.kota },
              { label:'Pendidikan', val: showDetail.pendidikan_terakhir },
              { label:'Status', val: showDetail.status },
              { label:'Training', val: showDetail.training_status },
              { label:'Pengalaman', val: showDetail.pengalaman },
            ].map(f => (
              <div key={f.label} style={{ display:'flex', gap:'12px', padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'100px', flexShrink:0 }}>{f.label}</span>
                <span style={{ color:'var(--text)', fontSize:'13px', fontWeight:500, wordBreak:'break-word' as const }}>{f.val || '-'}</span>
              </div>
            ))}
            <div style={{ marginTop:'16px', display:'flex', gap:'8px' }}>
              {[
                { s:'training', label:'Training', color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)' },
                { s:'available', label:'Tersedia', color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)' },
                { s:'inactive', label:'Nonaktif', color:'#ef4444', bg:'rgba(239,68,68,0.15)', border:'rgba(239,68,68,0.3)' },
              ].map(({ s, label, color, bg, border }) => (
                <button key={s} onClick={async () => {
                  try {
                    await apiClient.patch(`/internal/rekrutmen/mitra/${showDetail.id}`, { status: s });
                    setShowDetail({ ...showDetail, status: s });
                    fetchData();
                  } catch {}
                }} style={{ flex:1, padding:'8px', borderRadius:'10px', border:`1px solid ${border}`, background: showDetail.status === s ? bg : 'transparent', color, fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>

      {/* Modal Kredensial */}
      {showKredensial && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--card)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'400px', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'linear-gradient(135deg, #10b981, #059669)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                <span style={{ fontSize:'24px' }}>✓</span>
              </div>
              <h3 style={{ fontWeight:700, fontSize:'18px', color:'var(--text)' }}>Mitra Berhasil Didaftarkan!</h3>
              <p style={{ color:'var(--text3)', fontSize:'13px', marginTop:'4px' }}>Simpan kredensial login berikut</p>
            </div>

            <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'14px', padding:'16px', marginBottom:'16px' }}>
              <p style={{ color:'var(--text3)', fontSize:'11px', marginBottom:'12px', fontWeight:600, textTransform:'uppercase' }}>Kredensial Login Mitra</p>
              <div style={{ marginBottom:'10px' }}>
                <p style={{ color:'var(--text3)', fontSize:'11px' }}>Nama</p>
                <p style={{ color:'var(--text)', fontSize:'14px', fontWeight:600 }}>{showKredensial.name}</p>
              </div>
              <div style={{ marginBottom:'10px' }}>
                <p style={{ color:'var(--text3)', fontSize:'11px' }}>Email</p>
                <p style={{ color:'var(--text)', fontSize:'14px', fontWeight:600 }}>{showKredensial.email}</p>
              </div>
              <div>
                <p style={{ color:'var(--text3)', fontSize:'11px' }}>Password</p>
                <p style={{ color:'#10b981', fontSize:'18px', fontWeight:700, letterSpacing:'2px' }}>{showKredensial.password}</p>
              </div>
            </div>

            <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'10px', padding:'10px 12px', marginBottom:'16px' }}>
              <p style={{ color:'#f59e0b', fontSize:'12px' }}>⚠️ Catat dan bagikan kredensial ini ke mitra. Password tidak bisa dilihat lagi setelah ditutup.</p>
            </div>

            <button onClick={() => setShowKredensial(null)}
              style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'14px', cursor:'pointer' }}>
              Sudah Dicatat, Tutup
            </button>
          </div>
        </div>
      )}
  );
}
