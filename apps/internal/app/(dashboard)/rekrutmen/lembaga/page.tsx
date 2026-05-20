'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { Plus, Search, X, Building2, Phone, Mail, MapPin, Edit2, Trash2, DollarSign } from 'lucide-react';

const TIPE_OPTIONS = [
  { v:'lpk',        l:'LPK / Lembaga Pelatihan' },
  { v:'sekolah',    l:'Sekolah / SMK' },
  { v:'universitas',l:'Universitas / Politeknik' },
  { v:'komunitas',  l:'Komunitas' },
  { v:'perusahaan', l:'Perusahaan' },
  { v:'lainnya',    l:'Lainnya' },
];

const emptyForm = { nama:'', tipe:'lpk', kontak_nama:'', kontak_hp:'', kontak_email:'', alamat:'', kota:'', provinsi:'', fee_per_mitra:'', catatan:'' };

export default function LembagaPage() {
  const [data, setData]           = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFee, setShowFee]     = useState(false);
  const [editItem, setEditItem]   = useState<any>(null);
  const [form, setForm]           = useState({...emptyForm});
  const [saving, setSaving]       = useState(false);
  const [feeData, setFeeData]     = useState<any[]>([]);
  const [feeLoading, setFeeLoading] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    apiClient.get('/internal/lembaga')
      .then((r: any) => setData(r.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchFee = () => {
    setFeeLoading(true);
    apiClient.get('/internal/lembaga/fee/list')
      .then((r: any) => setFeeData(r.data?.data || []))
      .catch(() => {})
      .finally(() => setFeeLoading(false));
  };

  const set = (k: string, v: string) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editItem) await apiClient.put(`/internal/lembaga/${editItem.id}`, form);
      else          await apiClient.post('/internal/lembaga', form);
      setShowModal(false); setEditItem(null); setForm({...emptyForm});
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setSaving(false); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ nama: item.nama, tipe: item.tipe, kontak_nama: item.kontak_nama||'', kontak_hp: item.kontak_hp||'', kontak_email: item.kontak_email||'', alamat: item.alamat||'', kota: item.kota||'', provinsi: item.provinsi||'', fee_per_mitra: item.fee_per_mitra||'', catatan: item.catatan||'' });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Nonaktifkan lembaga ini?')) return;
    await apiClient.delete(`/internal/lembaga/${id}`).catch(() => {});
    fetchData();
  };

  const bayarFee = async (id: number) => {
    if (!confirm('Tandai fee ini sudah dibayar?')) return;
    await apiClient.post(`/internal/lembaga/fee/${id}/bayar`).catch(() => {});
    fetchFee();
  };

  const filtered = data.filter(d => JSON.stringify(d).toLowerCase().includes(search.toLowerCase()));

  const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };
  const lbl: React.CSSProperties = { color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Manajemen Lembaga</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>{data.length} lembaga terdaftar — mitra rekrutmen via kerjasama</p>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={() => { setShowFee(true); fetchFee(); }} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 14px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'12px', color:'#10b981', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <DollarSign size={15}/>Kontrol Fee
          </button>
          <button onClick={() => { setShowModal(true); setEditItem(null); setForm({...emptyForm}); }} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>Tambah Lembaga
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
        <Search size={16} style={{ color:'var(--text3)' }}/>
        <input placeholder="Cari nama lembaga, kota..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }}/>
      </div>

      {/* Grid Lembaga */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'14px' }}>
          {[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'16px', height:'160px' }}/>)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px', color:'var(--text3)' }}>
          <Building2 size={48} style={{ margin:'0 auto 14px', opacity:0.2 }}/>
          <p style={{ fontWeight:600 }}>Belum ada lembaga</p>
          <p style={{ fontSize:'13px' }}>Tambah lembaga kerjasama untuk mulai merekrut mitra</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'14px' }}>
          {filtered.map((item: any) => (
            <div key={item.id} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                    <Building2 size={14} style={{ color:'var(--purple-light)' }}/>
                    <span style={{ fontSize:'11px', color:'var(--purple-light)', fontWeight:600, textTransform:'uppercase' }}>
                      {TIPE_OPTIONS.find(t => t.v === item.tipe)?.l || item.tipe}
                    </span>
                  </div>
                  <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>{item.nama}</p>
                </div>
                <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 8px', borderRadius:'8px', background: item.status==='aktif'?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', color: item.status==='aktif'?'#10b981':'#ef4444' }}>
                  {item.status}
                </span>
              </div>

              {item.kota && <p style={{ fontSize:'12px', color:'var(--text3)', display:'flex', alignItems:'center', gap:'4px', marginBottom:'4px' }}><MapPin size={11}/>{item.kota}{item.provinsi ? `, ${item.provinsi}` : ''}</p>}
              {item.kontak_hp && <p style={{ fontSize:'12px', color:'var(--text3)', display:'flex', alignItems:'center', gap:'4px', marginBottom:'4px' }}><Phone size={11}/>{item.kontak_hp}</p>}

              <div style={{ borderTop:'1px solid var(--border)', paddingTop:'10px', marginTop:'10px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontSize:'11px', color:'var(--text3)' }}>Fee per Mitra</p>
                  <p style={{ fontSize:'14px', fontWeight:700, color:'#10b981' }}>
                    {item.fee_per_mitra > 0 ? `Rp ${Number(item.fee_per_mitra).toLocaleString('id-ID')}` : 'Tidak ada'}
                  </p>
                  <p style={{ fontSize:'11px', color:'var(--text3)' }}>{item.mitra_count || 0} mitra dari lembaga ini</p>
                </div>
                <div style={{ display:'flex', gap:'6px' }}>
                  <button onClick={() => handleEdit(item)} style={{ padding:'6px 10px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'8px', color:'#3b82f6', cursor:'pointer', display:'flex', alignItems:'center' }}>
                    <Edit2 size={13}/>
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding:'6px 10px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', cursor:'pointer', display:'flex', alignItems:'center' }}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit Lembaga */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, overflowY:'auto', padding:'20px', display:'flex', alignItems:'flex-start', justifyContent:'center' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'560px', padding:'24px', margin:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)' }}>{editItem ? 'Edit Lembaga' : 'Tambah Lembaga'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={lbl}>Nama Lembaga *</label>
                  <input required value={form.nama} onChange={e => set('nama',e.target.value)} style={inp} placeholder="LPK Kesehatan Nusantara"/>
                </div>
                <div>
                  <label style={lbl}>Tipe Lembaga *</label>
                  <select required value={form.tipe} onChange={e => set('tipe',e.target.value)} style={inp}>
                    {TIPE_OPTIONS.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Fee per Mitra (Rp)</label>
                  <input type="number" value={form.fee_per_mitra} onChange={e => set('fee_per_mitra',e.target.value)} style={inp} placeholder="0"/>
                </div>
                <div><label style={lbl}>Nama PIC / Kontak</label><input value={form.kontak_nama} onChange={e => set('kontak_nama',e.target.value)} style={inp}/></div>
                <div><label style={lbl}>No. HP / WA</label><input value={form.kontak_hp} onChange={e => set('kontak_hp',e.target.value)} style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Email</label><input type="email" value={form.kontak_email} onChange={e => set('kontak_email',e.target.value)} style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Alamat</label><input value={form.alamat} onChange={e => set('alamat',e.target.value)} style={inp}/></div>
                <div><label style={lbl}>Kota</label><input value={form.kota} onChange={e => set('kota',e.target.value)} style={inp}/></div>
                <div><label style={lbl}>Provinsi</label><input value={form.provinsi} onChange={e => set('provinsi',e.target.value)} style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Catatan</label><textarea value={form.catatan} onChange={e => set('catatan',e.target.value)} style={{...inp,minHeight:'60px',resize:'vertical'as const}}/></div>
              </div>
              <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'20px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding:'10px 20px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={saving} style={{ padding:'10px 24px', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {saving ? 'Menyimpan...' : editItem ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Kontrol Fee */}
      {showFee && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, overflowY:'auto', padding:'20px', display:'flex', alignItems:'flex-start', justifyContent:'center' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'700px', padding:'24px', margin:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)' }}>Kontrol Fee</h2>
              <button onClick={() => setShowFee(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={18}/></button>
            </div>
            {feeLoading ? (
              <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Memuat data fee...</div>
            ) : feeData.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
                <DollarSign size={40} style={{ margin:'0 auto 12px', opacity:0.2 }}/>
                <p>Belum ada fee yang perlu dibayar</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {feeData.map((f: any) => (
                  <div key={f.id} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'14px', padding:'14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{f.mitra?.nama_lengkap}</p>
                      <p style={{ fontSize:'12px', color:'var(--text3)' }}>
                        {f.sumber_tipe === 'lembaga'
                          ? `🏫 ${f.lembaga?.nama}`
                          : f.sumber_tipe === 'orang_terdekat'
                            ? `👥 Referrer: ${f.referrer_mitra?.nama_lengkap}`
                            : `🔍 ${f.sumber_detail}`}
                      </p>
                    </div>
                    <div style={{ textAlign:'right', display:'flex', alignItems:'center', gap:'10px' }}>
                      <div>
                        <p style={{ fontSize:'15px', fontWeight:700, color: f.fee_amount > 0 ? '#10b981' : 'var(--text3)' }}>
                          Rp {Number(f.fee_amount).toLocaleString('id-ID')}
                        </p>
                        <span style={{ fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'6px', background: f.fee_status==='paid'?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.1)', color: f.fee_status==='paid'?'#10b981':'#f59e0b' }}>
                          {f.fee_status === 'paid' ? '✓ Dibayar' : '⏳ Pending'}
                        </span>
                      </div>
                      {f.fee_status === 'pending' && f.fee_amount > 0 && (
                        <button onClick={() => bayarFee(f.id)} style={{ padding:'7px 12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'8px', color:'#10b981', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                          Bayar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
