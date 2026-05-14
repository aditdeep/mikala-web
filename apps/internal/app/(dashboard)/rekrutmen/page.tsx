'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { Users, Plus, Search, X, ChevronRight, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

const PENDIDIKAN = ['SMA Negeri / Swasta','MA, MAN, atau Sekolah Keagamaan Lainnya','SMK / Sekolah Kejuruan Kesehatan','SMK / Sekolah Kejuruan Lainnya (selain kesehatan)','Diploma D1/D2/D3 Kesehatan','Diploma D1/D2/D3 Lainnya (selain kesehatan)','Sarjana S1 Kesehatan Farmasi, Bidan, dan lainnya (kecuali keperawatan.)','Sarjana S1 Keperawatan','Profesi Nurse','Sarjana S1 Lainnya (selain kesehatan)'];
const TIPE_PEKERJAAN = ['Perawat Homecare','Perawat Lansia / Caregiver','Babysitter','Babysitter New Born Care','Perawat Jiwa','Caregiver / Kaigo (Jepang)','Ke Jepang Lainnya'];
const AGAMA = ['Islam','Kristen Protestan','Kristen Katolik','Hindu','Budha','Konghucu'];
const HEWAN = ['Tidak takut semua hewan','Anjing','Kucing'];

const inputStyle = {
  width:'100%', padding:'9px 12px',
  background:'var(--bg)', border:'1px solid var(--border)',
  borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none',
};
const labelStyle = { color:'var(--text2)', fontSize:'12px', fontWeight:500 as const, display:'block' as const, marginBottom:'5px' };
const sectionStyle = { background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'14px', padding:'16px', marginBottom:'12px' };

const emptyForm = {
  nama:'', phone:'', nik:'', usia:'', tempat_lahir:'', tanggal_lahir:'',
  alamat:'', kelurahan:'', kecamatan:'', kota:'', provinsi:'', suku:'',
  pendidikan:'', jenis_kelamin:'Laki-laki', tinggi:'', berat:'', vaksin:'',
  status_nikah:'Belum Menikah / Lajang', agama:'Islam', takut_hewan:'Tidak takut semua hewan',
  bisa_memasak:'3', tipe_pekerjaan:'Perawat Homecare',
  pengalaman_pelatihan:'', pengalaman_kerja:'', status_rekrutmen:'pending',
};

export default function RekrutmenPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('semua');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    apiClient.get('/internal/rekrutmen/mitra')
      .then((res: any) => { setData(Array.isArray(res.data?.data) ? res.data.data : []); setLoading(false); })
      .catch(() => { setData([]); setLoading(false); });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/internal/rekrutmen/mitra', form);
      setShowModal(false);
      setForm({ ...emptyForm });
      fetchData();
    } catch {
      alert('Gagal menyimpan data');
    } finally { setSaving(false); }
  };

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const filtered = data.filter(d =>
    (activeTab === 'semua' || d.status_rekrutmen === activeTab) &&
    JSON.stringify(d).toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    semua: data.length,
    pending: data.filter(d => d.status_rekrutmen === 'pending').length,
    approved: data.filter(d => d.status_rekrutmen === 'approved').length,
    rejected: data.filter(d => d.status_rekrutmen === 'rejected').length,
  };

  const statusBadge = (s: string) => {
    const map: any = {
      pending: { color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)', label:'Pending', icon: Clock },
      approved: { color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)', label:'Diterima', icon: CheckCircle },
      rejected: { color:'#ef4444', bg:'rgba(239,68,68,0.15)', border:'rgba(239,68,68,0.3)', label:'Ditolak', icon: XCircle },
    };
    return map[s] || map.pending;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Rekrutmen</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>{data.length} total pelamar</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer', boxShadow:'0 4px 12px rgba(124,58,237,0.35)' }}>
          <Plus size={15} />Tambah Pelamar
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {(['semua','pending','approved','rejected'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding:'6px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:600, cursor:'pointer', border:'none',
            background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'var(--glass)',
            color: activeTab === tab ? 'white' : 'var(--text2)',
            border: activeTab !== tab ? '1px solid var(--border)' : 'none',
          }}>
            {tab === 'semua' ? 'Semua' : tab === 'pending' ? 'Pending' : tab === 'approved' ? 'Diterima' : 'Ditolak'} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(16px)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
        <Search size={16} style={{ color:'var(--text3)', flexShrink:0 }} />
        <input placeholder="Cari nama, kota, tipe pekerjaan..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
      </div>

      {/* Table */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        {loading ? (
          <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
            {[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px' }} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'600px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Nama','Kota','Tipe Pekerjaan','Pendidikan','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item: any, i: number) => {
                  const badge = statusBadge(item.status_rekrutmen);
                  const Icon = badge.icon;
                  return (
                    <tr key={item.id || i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--purple-light)', fontSize:'13px', fontWeight:700, flexShrink:0 }}>
                            {item.nama?.[0]?.toUpperCase() || 'M'}
                          </div>
                          <div>
                            <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{item.nama || '-'}</p>
                            <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.phone || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text2)' }}>{item.kota || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text2)', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.tipe_pekerjaan || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px', color:'var(--text2)', maxWidth:'140px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.pendidikan || '-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:badge.bg, color:badge.color, border:`1px solid ${badge.border}`, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                          <Icon size={11} />{badge.label}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <button onClick={() => setShowDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'8px', color:'var(--purple-light)', fontSize:'12px', fontWeight:500, cursor:'pointer' }}>
                          <Eye size={12} />Detail
                        </button>
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
            <p style={{ fontWeight:600, color:'var(--text)' }}>Belum ada data</p>
            <p style={{ color:'var(--text3)', fontSize:'13px', marginTop:'4px' }}>Klik "Tambah Pelamar" untuk menambahkan data baru</p>
          </div>
        )}
      </div>

      {/* Modal Form Tambah */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'680px', padding:'24px', margin:'auto', position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <div>
                <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)' }}>Form Pendaftaran Mitra</h2>
                <p style={{ color:'var(--text3)', fontSize:'13px' }}>Isi data pelamar dengan lengkap</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Section 1: Data Pribadi */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>📋 Data Pribadi</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={labelStyle}>Nama Lengkap (sesuai KTP) *</label>
                    <input required value={form.nama} onChange={e => set('nama', e.target.value)} style={inputStyle} placeholder="Nama lengkap sesuai KTP" />
                  </div>
                  <div>
                    <label style={labelStyle}>Nomor HP/Ponsel *</label>
                    <input required value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} placeholder="08xxxxxxxxxx" />
                  </div>
                  <div>
                    <label style={labelStyle}>NIK / Nomor KTP *</label>
                    <input required value={form.nik} onChange={e => set('nik', e.target.value)} style={inputStyle} placeholder="16 digit NIK" />
                  </div>
                  <div>
                    <label style={labelStyle}>Usia *</label>
                    <input required type="number" value={form.usia} onChange={e => set('usia', e.target.value)} style={inputStyle} placeholder="Usia saat ini" />
                  </div>
                  <div>
                    <label style={labelStyle}>Tempat Lahir *</label>
                    <input required value={form.tempat_lahir} onChange={e => set('tempat_lahir', e.target.value)} style={inputStyle} placeholder="Kota tempat lahir" />
                  </div>
                  <div>
                    <label style={labelStyle}>Tanggal Lahir *</label>
                    <input required type="date" value={form.tanggal_lahir} onChange={e => set('tanggal_lahir', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Jenis Kelamin *</label>
                    <select value={form.jenis_kelamin} onChange={e => set('jenis_kelamin', e.target.value)} style={inputStyle}>
                      <option>Laki-laki</option>
                      <option>Perempuan</option>
                    </select>
                  </div>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={labelStyle}>Alamat sesuai KTP *</label>
                    <input required value={form.alamat} onChange={e => set('alamat', e.target.value)} style={inputStyle} placeholder="Alamat lengkap sesuai KTP" />
                  </div>
                  <div>
                    <label style={labelStyle}>Kelurahan *</label>
                    <input required value={form.kelurahan} onChange={e => set('kelurahan', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Kecamatan *</label>
                    <input required value={form.kecamatan} onChange={e => set('kecamatan', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Kota *</label>
                    <input required value={form.kota} onChange={e => set('kota', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Provinsi *</label>
                    <input required value={form.provinsi} onChange={e => set('provinsi', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Suku</label>
                    <input value={form.suku} onChange={e => set('suku', e.target.value)} style={inputStyle} placeholder="Opsional" />
                  </div>
                  <div>
                    <label style={labelStyle}>Status Pernikahan</label>
                    <select value={form.status_nikah} onChange={e => set('status_nikah', e.target.value)} style={inputStyle}>
                      <option>Menikah</option>
                      <option>Belum Menikah / Lajang</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Data Fisik & Tambahan */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>💪 Data Fisik & Tambahan</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div>
                    <label style={labelStyle}>Tinggi Badan (CM) *</label>
                    <input required type="number" value={form.tinggi} onChange={e => set('tinggi', e.target.value)} style={inputStyle} placeholder="cth: 165" />
                  </div>
                  <div>
                    <label style={labelStyle}>Berat Badan (KG) *</label>
                    <input required type="number" value={form.berat} onChange={e => set('berat', e.target.value)} style={inputStyle} placeholder="cth: 55" />
                  </div>
                  <div>
                    <label style={labelStyle}>Vaksin *</label>
                    <input required value={form.vaksin} onChange={e => set('vaksin', e.target.value)} style={inputStyle} placeholder="cth: Covid, Hepatitis" />
                  </div>
                  <div>
                    <label style={labelStyle}>Agama *</label>
                    <select value={form.agama} onChange={e => set('agama', e.target.value)} style={inputStyle}>
                      {AGAMA.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Takut Hewan Peliharaan *</label>
                    <select value={form.takut_hewan} onChange={e => set('takut_hewan', e.target.value)} style={inputStyle}>
                      {HEWAN.map(h => <option key={h}>{h}</option>)}
                      <option>Yang lain</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Kemampuan Memasak (1-5) *</label>
                    <select value={form.bisa_memasak} onChange={e => set('bisa_memasak', e.target.value)} style={inputStyle}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} - {n===1?'Tidak bisa':n===5?'Sangat mahir':n===2?'Sedikit bisa':n===3?'Cukup bisa':'Mahir'}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Pendidikan & Pekerjaan */}
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
                    <select required value={form.tipe_pekerjaan} onChange={e => set('tipe_pekerjaan', e.target.value)} style={inputStyle}>
                      {TIPE_PEKERJAAN.map(t => <option key={t}>{t}</option>)}
                      <option>Yang lain</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Pengalaman */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>💼 Pengalaman Sebelumnya</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  <div>
                    <label style={labelStyle}>Pelatihan / Pendidikan non-formal *</label>
                    <textarea required value={form.pengalaman_pelatihan} onChange={e => set('pengalaman_pelatihan', e.target.value)} style={{ ...inputStyle, minHeight:'80px', resize:'vertical' as const }} placeholder="Sebutkan pelatihan yang pernah diikuti, atau tulis 'Tidak ada'" />
                  </div>
                  <div>
                    <label style={labelStyle}>Pengalaman Kerja / Magang *</label>
                    <textarea required value={form.pengalaman_kerja} onChange={e => set('pengalaman_kerja', e.target.value)} style={{ ...inputStyle, minHeight:'80px', resize:'vertical' as const }} placeholder="Ceritakan pengalaman kerja, atau tulis 'Tidak ada'" />
                  </div>
                  <div>
                    <label style={labelStyle}>Status Rekrutmen</label>
                    <select value={form.status_rekrutmen} onChange={e => set('status_rekrutmen', e.target.value)} style={inputStyle}>
                      <option value="pending">Pending</option>
                      <option value="approved">Diterima</option>
                      <option value="rejected">Ditolak</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'4px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding:'10px 20px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
                  Batal
                </button>
                <button type="submit" disabled={saving} style={{ padding:'10px 24px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {showDetail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'560px', padding:'24px', maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Detail Pelamar</h2>
              <button onClick={() => setShowDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}>
                <X size={18} />
              </button>
            </div>

            {/* Avatar */}
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'20px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:'24px', fontWeight:700, color:'white' }}>
                {showDetail.nama?.[0]?.toUpperCase() || 'M'}
              </div>
              <p style={{ fontWeight:700, fontSize:'16px', color:'var(--text)' }}>{showDetail.nama}</p>
              <p style={{ color:'var(--text3)', fontSize:'13px' }}>{showDetail.tipe_pekerjaan}</p>
              {(() => {
                const badge = statusBadge(showDetail.status_rekrutmen);
                const Icon = badge.icon;
                return (
                  <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:badge.bg, color:badge.color, border:`1px solid ${badge.border}`, borderRadius:'8px', padding:'4px 12px', fontSize:'12px', fontWeight:600, marginTop:'8px' }}>
                    <Icon size={12} />{badge.label}
                  </span>
                );
              })()}
            </div>

            {/* Detail Fields */}
            {[
              { label:'Nomor HP', val: showDetail.phone },
              { label:'NIK', val: showDetail.nik },
              { label:'Usia', val: showDetail.usia ? `${showDetail.usia} tahun` : '-' },
              { label:'Tempat, Tgl Lahir', val: `${showDetail.tempat_lahir || '-'}, ${showDetail.tanggal_lahir || '-'}` },
              { label:'Jenis Kelamin', val: showDetail.jenis_kelamin },
              { label:'Alamat', val: showDetail.alamat },
              { label:'Kota', val: `${showDetail.kelurahan || ''} ${showDetail.kecamatan || ''} ${showDetail.kota || ''} ${showDetail.provinsi || ''}`.trim() },
              { label:'Pendidikan', val: showDetail.pendidikan },
              { label:'Tinggi / Berat', val: `${showDetail.tinggi || '-'} cm / ${showDetail.berat || '-'} kg` },
              { label:'Vaksin', val: showDetail.vaksin },
              { label:'Agama', val: showDetail.agama },
              { label:'Status Nikah', val: showDetail.status_nikah },
              { label:'Takut Hewan', val: showDetail.takut_hewan },
              { label:'Kemampuan Memasak', val: showDetail.bisa_memasak ? `${showDetail.bisa_memasak}/5` : '-' },
              { label:'Pelatihan', val: showDetail.pengalaman_pelatihan },
              { label:'Pengalaman Kerja', val: showDetail.pengalaman_kerja },
            ].map(f => (
              <div key={f.label} style={{ display:'flex', gap:'12px', padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'130px', flexShrink:0 }}>{f.label}</span>
                <span style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{f.val || '-'}</span>
              </div>
            ))}

            {/* Update Status */}
            <div style={{ marginTop:'16px', display:'flex', gap:'8px' }}>
              {['pending','approved','rejected'].map(s => {
                const badge = statusBadge(s);
                return (
                  <button key={s} onClick={async () => {
                    try {
                      await apiClient.patch(`/internal/rekrutmen/mitra/${showDetail.id}`, { status_rekrutmen: s });
                      setShowDetail({ ...showDetail, status_rekrutmen: s });
                      fetchData();
                    } catch {}
                  }} style={{
                    flex:1, padding:'8px', borderRadius:'10px', border:`1px solid ${badge.border}`,
                    background: showDetail.status_rekrutmen === s ? badge.bg : 'transparent',
                    color: badge.color, fontSize:'12px', fontWeight:600, cursor:'pointer',
                  }}>
                    {badge.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
