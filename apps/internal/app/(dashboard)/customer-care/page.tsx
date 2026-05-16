'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { Headphones, Search, Eye, X, Plus, CheckCircle, Clock, AlertCircle, Users, HeartPulse, MessageSquare, BarChart2, UserPlus, Check, Briefcase } from 'lucide-react';

const statusMap: any = {
  pending:     { label:'Pending',      color:'#f59e0b', bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.3)',  icon: Clock },
  confirmed:   { label:'Dikonfirmasi', color:'#3b82f6', bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.3)',  icon: CheckCircle },
  in_progress: { label:'Berjalan',     color:'#10b981', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.3)',  icon: CheckCircle },
  completed:   { label:'Selesai',      color:'#6b7280', bg:'rgba(107,114,128,0.15)', border:'rgba(107,114,128,0.3)', icon: CheckCircle },
  cancelled:   { label:'Dibatalkan',   color:'#ef4444', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.3)',   icon: AlertCircle },
  on_hold:     { label:'Ditahan',      color:'#8b5cf6', bg:'rgba(139,92,246,0.15)',  border:'rgba(139,92,246,0.3)',  icon: Clock },
};

const TABS = [
  { key:'layanan',  label:'Layanan',  icon: HeartPulse },
  { key:'orders',   label:'Orders',   icon: Briefcase },
  { key:'klien',    label:'Klien',    icon: Users },
  { key:'pasien',   label:'Pasien',   icon: UserPlus },
  { key:'feedback', label:'Feedback', icon: MessageSquare },
  { key:'report',   label:'Report',   icon: BarChart2 },
];

export default function CustomerCarePage() {
  const [activeTab, setActiveTab] = useState('layanan');
  const [layanan, setLayanan] = useState<any[]>([]);
  const [klien, setKlien] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<any>(null);

  // Form klien
  const [showFormKlien, setShowFormKlien] = useState(false);
  const [formKlien, setFormKlien] = useState({ nama:'', email:'', phone:'', alamat:'', kota:'', provinsi:'', tipe:'individu', password:'password123' });
  const [savingKlien, setSavingKlien] = useState(false);
  const [kredensial, setKredensial] = useState<any>(null);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [showFormOrder, setShowFormOrder] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [mitraList, setMitraList] = useState<any[]>([]);
  const [formOrder, setFormOrder] = useState({
    klien_id:'', pasien_id:'', mitra_id:'', layanan_type:'homecare_harian',
    tanggal_mulai:'', tanggal_selesai:'', lokasi:'', harga_per_shift:'0', total_shift:'1', deskripsi:''
  });

  // Form pasien
  const [showFormPasien, setShowFormPasien] = useState(false);
  const [formPasien, setFormPasien] = useState({ klien_id:'', nama_lengkap:'', tanggal_lahir:'', jenis_kelamin:'L', golongan_darah:'', alamat:'', riwayat_penyakit:'', alergi:'', kontak_darurat_nama:'', kontak_darurat_phone:'', kontak_darurat_relasi:'keluarga' });
  const [savingPasien, setSavingPasien] = useState(false);
  const [pasienList, setPasienList] = useState<any[]>([]);

  // Feedback
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [showFormFeedback, setShowFormFeedback] = useState(false);
  const [formFeedback, setFormFeedback] = useState({ klien_id:'', rating:'5', catatan:'', tipe:'layanan' });
  const [savingFeedback, setSavingFeedback] = useState(false);

  // Report
  const [report, setReport] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Pasien expand
  const [expandedKlien, setExpandedKlien] = useState<number|null>(null);
  const [pasienDetail, setPasienDetail] = useState<Record<number,any[]>>({});
  const [loadingPasien, setLoadingPasien] = useState<number|null>(null);

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    if (activeTab === 'pasien') fetchPasien();
    if (activeTab === 'feedback') fetchFeedback();
    if (activeTab === 'report') fetchReport();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      apiClient.get('/internal/cc/layanan').then((r: any) => setLayanan(Array.isArray(r.data?.data) ? r.data.data : [])),
      apiClient.get('/internal/cc/klien').then((r: any) => {
        const d = r.data?.data;
        setKlien(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      }),
    ]).finally(() => setLoading(false));
  };

  const fetchOrders = () => {
    apiClient.get('/internal/cc/layanan').then((r: any) => {
      const d = r.data?.data;
      setOrders(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
    }).catch(() => {});
    apiClient.get('/internal/mitra-list').then((r: any) => {
      setMitraList(Array.isArray(r.data?.data) ? r.data.data : []);
    }).catch(() => {});
  };

  const fetchPasien = () => {
    apiClient.get('/internal/cc/klien').then((r: any) => {
      const d = r.data?.data;
      const list = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
      setPasienList(list);
    }).catch(() => {});
  };

  const fetchFeedback = () => {
    apiClient.get('/internal/cc/feedback').then((r: any) => {
      setFeedbackList(Array.isArray(r.data?.data) ? r.data.data : []);
    }).catch(() => {});
  };

  const fetchReport = () => {
    setLoadingReport(true);
    Promise.all([
      apiClient.get('/internal/cc/report/handling'),
      apiClient.get('/internal/cc/report/deal'),
      apiClient.get('/internal/cc/report/loss'),
    ]).then(([handling, deal, loss]: any) => {
      setReport({
        handling: handling.data?.data,
        deal: deal.data?.data,
        loss: loss.data?.data,
      });
      setLoadingReport(false);
    }).catch(() => setLoadingReport(false));
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOrder(true);
    try {
      await apiClient.post('/internal/cc/layanan', formOrder);
      setShowFormOrder(false);
      setFormOrder({ klien_id:'', pasien_id:'', mitra_id:'', layanan_type:'homecare_harian', tanggal_mulai:'', tanggal_selesai:'', lokasi:'', harga_per_shift:'0', total_shift:'1', deskripsi:'' });
      fetchOrders();
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal membuat order'); }
    finally { setSavingOrder(false); }
  };

  const handleRegisterKlien = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKlien(true);
    try {
      await apiClient.post('/internal/cc/registrasi/klien', {
        name: formKlien.nama, email: formKlien.email, phone: formKlien.phone,
        password: formKlien.password, alamat: formKlien.alamat,
        kota: formKlien.kota, provinsi: formKlien.provinsi, tipe: formKlien.tipe,
      });
      setShowFormKlien(false);
      setKredensial({ name: formKlien.nama, email: formKlien.email, password: formKlien.password });
      setFormKlien({ nama:'', email:'', phone:'', alamat:'', kota:'', provinsi:'', tipe:'individu', password:'password123' });
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal mendaftar klien'); }
    finally { setSavingKlien(false); }
  };

  const handleRegisterPasien = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPasien(true);
    try {
      await apiClient.post('/internal/cc/registrasi/pasien', formPasien);
      setShowFormPasien(false);
      setFormPasien({ klien_id:'', nama_lengkap:'', tanggal_lahir:'', jenis_kelamin:'L', golongan_darah:'', alamat:'', riwayat_penyakit:'', alergi:'', kontak_darurat_nama:'', kontak_darurat_phone:'', kontak_darurat_relasi:'keluarga' });
      alert('Pasien berhasil didaftarkan!');
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal mendaftar pasien'); }
    finally { setSavingPasien(false); }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFeedback(true);
    try {
      await apiClient.post('/internal/cc/feedback', formFeedback);
      setShowFormFeedback(false);
      setFormFeedback({ klien_id:'', rating:'5', catatan:'', tipe:'layanan' });
      fetchFeedback();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal menyimpan feedback'); }
    finally { setSavingFeedback(false); }
  };

  const updateLayananStatus = async (id: number, status: string) => {
    try {
      await apiClient.patch('/internal/cc/layanan/' + id + '/status', { status });
      fetchAll();
      if (detail) setDetail({ ...detail, status });
    } catch {}
  };

  const inp = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };
  const cardStyle = { background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' };

  return (
    <div className="space-y-4">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Customer Care</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Kelola layanan, klien & pasien</p>
        </div>
        {activeTab === 'orders' && (
          <button onClick={() => { setShowFormOrder(true); fetchOrders(); }} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>Buat Order
          </button>
        )}
        {activeTab === 'klien' && (
          <button onClick={() => setShowFormKlien(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>Daftarkan Klien
          </button>
        )}
        {activeTab === 'pasien' && (
          <button onClick={() => setShowFormPasien(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>Daftarkan Pasien
          </button>
        )}
        {activeTab === 'feedback' && (
          <button onClick={() => setShowFormFeedback(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>Tambah Feedback
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px' }}>
        {[
          { icon: HeartPulse, label:'Total Layanan', value: layanan.length, gradient:'linear-gradient(135deg, #ec4899, #8b5cf6)' },
          { icon: Users, label:'Total Klien', value: klien.length, gradient:'linear-gradient(135deg, #7c3aed, #4f46e5)' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:s.gradient, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={18} color="white" />
                </div>
                <div>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>{s.label}</p>
                  <p style={{ fontWeight:700, fontSize:'20px', color:'var(--text)' }}>{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'12px', fontSize:'13px', fontWeight:600, cursor:'pointer', background: activeTab===t.key ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'var(--glass)', color: activeTab===t.key ? 'white' : 'var(--text2)', border: activeTab===t.key ? 'none' : '1px solid var(--border)' }}>
              <Icon size={14}/>{t.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      {['layanan','klien'].includes(activeTab) && (
        <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
          <Search size={16} style={{ color:'var(--text3)' }} />
          <input placeholder={'Cari '+activeTab+'...'} value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
        </div>
      )}

      {/* TAB LAYANAN */}
      {activeTab === 'layanan' && (
        <div style={cardStyle}>
          {loading ? (
            <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Tipe Layanan','Klien','Mitra','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {layanan.filter(l => JSON.stringify(l).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => {
                    const s = statusMap[item.status] || statusMap.pending;
                    const Icon = s.icon;
                    return (
                      <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{item.tipe_layanan?.replace(/_/g,' ')||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.klien?.nama_lengkap||item.klien?.user?.name||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.mitra?.user?.name||'-'}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:s.bg, color:s.color, border:'1px solid '+s.border, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                            <Icon size={11}/>{s.label}
                          </span>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'8px', color:'#ec4899', fontSize:'12px', cursor:'pointer' }}>
                            <Eye size={12}/>Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {layanan.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data layanan</div>}
            </div>
          )}
        </div>
      )}

      {/* TAB ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
            <Search size={16} style={{ color:'var(--text3)' }} />
            <input placeholder="Cari order..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
          </div>
          <div style={cardStyle}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'600px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Order #','Klien','Mitra','Layanan','Tgl Mulai','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {orders.filter(o => JSON.stringify(o).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => {
                    const s = statusMap[item.status] || statusMap.pending;
                    const Icon = s.icon;
                    return (
                      <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'12px 16px', fontWeight:600, fontSize:'13px', color:'var(--text)' }}>#{item.id}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.klien?.nama_lengkap||item.klien?.user?.name||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.mitra?.user?.name||<span style={{color:'#f59e0b'}}>Belum assign</span>}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', textTransform:'capitalize' }}>{(item.tipe_layanan||item.layanan_type||'-').replace(/_/g,' ')}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.tanggal_mulai ? new Date(item.tanggal_mulai).toLocaleDateString('id-ID') : '-'}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:s.bg, color:s.color, border:'1px solid '+s.border, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                            <Icon size={11}/>{s.label}
                          </span>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'8px', color:'#ec4899', fontSize:'12px', cursor:'pointer' }}>
                            <Eye size={12}/>Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {orders.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada order</div>}
            </div>
          </div>
        </div>
      )}

      {/* TAB KLIEN */}
      {activeTab === 'klien' && (
        <div style={cardStyle}>
          {loading ? (
            <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'400px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Nama','Email','Telepon','Tipe','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {klien.filter(k => JSON.stringify(k).toLowerCase().includes(search.toLowerCase())).map((item: any, i: number) => (
                    <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:'rgba(236,72,153,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#ec4899', fontSize:'12px', fontWeight:700 }}>
                            {(item.nama_lengkap||item.user?.name||'K')[0].toUpperCase()}
                          </div>
                          <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{item.nama_lengkap||item.user?.name||'-'}</p>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.user?.email||'-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.user?.phone||'-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', textTransform:'capitalize' }}>{item.tipe||'-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ background:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                          {item.status||'Aktif'}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'8px', color:'var(--purple-light)', fontSize:'12px', cursor:'pointer' }}>
                          <Eye size={12}/>Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {klien.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data klien</div>}
            </div>
          )}
        </div>
      )}

      {/* TAB PASIEN */}
      {activeTab === 'pasien' && (
        <div className="space-y-3">
          {pasienList.length === 0 ? (
            <div style={{...cardStyle, textAlign:'center', padding:'40px', color:'var(--text3)'}}>Belum ada data klien</div>
          ) : pasienList.map((item: any) => {
            const isExpanded = expandedKlien === item.id;
            const pasiens = pasienDetail[item.id] || [];
            return (
              <div key={item.id} style={cardStyle}>
                {/* Header klien */}
                <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}
                  onClick={async () => {
                    if (isExpanded) { setExpandedKlien(null); return; }
                    setExpandedKlien(item.id);
                    if (!pasienDetail[item.id]) {
                      setLoadingPasien(item.id);
                      try {
                        const r: any = await apiClient.get('/internal/cc/klien/' + item.id);
                        const p = r.data?.data?.pasien || r.data?.data?.pasiens || [];
                        setPasienDetail(prev => ({...prev, [item.id]: p}));
                      } catch {}
                      setLoadingPasien(null);
                    }
                  }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(236,72,153,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#ec4899', fontWeight:700, fontSize:'14px' }}>
                      {(item.nama_lengkap||item.user?.name||'K')[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>{item.nama_lengkap||item.user?.name||'-'}</p>
                      <p style={{ color:'var(--text3)', fontSize:'11px', textTransform:'capitalize' }}>{item.tipe||'individu'} · {item.total_pasien||0} pasien</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <button onClick={e => { e.stopPropagation(); setFormPasien(p => ({...p, klien_id: item.id})); setShowFormPasien(true); }}
                      style={{ display:'flex', alignItems:'center', gap:'4px', padding:'5px 10px', background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'8px', color:'#ec4899', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>
                      <Plus size={11}/>Tambah
                    </button>
                    <span style={{ color:'var(--text3)', fontSize:'18px', lineHeight:1 }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Daftar pasien */}
                {isExpanded && (
                  <div style={{ borderTop:'1px solid var(--border)' }}>
                    {loadingPasien === item.id ? (
                      <div style={{ padding:'16px', textAlign:'center', color:'var(--text3)', fontSize:'13px' }}>Memuat pasien...</div>
                    ) : pasiens.length === 0 ? (
                      <div style={{ padding:'16px', textAlign:'center', color:'var(--text3)', fontSize:'13px' }}>Belum ada pasien terdaftar</div>
                    ) : pasiens.map((p: any, i: number) => (
                      <div key={p.id||i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 16px', borderBottom: i < pasiens.length-1 ? '1px solid var(--border)' : 'none', background:'rgba(236,72,153,0.03)' }}>
                        <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:'rgba(236,72,153,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#ec4899', fontSize:'12px', fontWeight:700, flexShrink:0 }}>
                          {(p.nama_lengkap||'P')[0].toUpperCase()}
                        </div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{p.nama_lengkap||'-'}</p>
                          <p style={{ color:'var(--text3)', fontSize:'11px' }}>
                            {p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                            {p.tanggal_lahir ? ' · ' + (new Date().getFullYear() - new Date(p.tanggal_lahir).getFullYear()) + ' tahun' : ''}
                            {p.golongan_darah ? ' · Gol. ' + p.golongan_darah : ''}
                          </p>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          {p.riwayat_penyakit && <p style={{ color:'var(--text3)', fontSize:'11px', maxWidth:'120px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.riwayat_penyakit}</p>}
                          {p.alergi && <p style={{ color:'#f59e0b', fontSize:'10px' }}>⚠️ {p.alergi}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB FEEDBACK */}
      {activeTab === 'feedback' && (
        <div style={cardStyle}>
          {feedbackList.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
              <MessageSquare size={36} style={{ opacity:0.3, margin:'0 auto 10px' }}/>
              <p>Belum ada feedback</p>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'400px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Klien','Rating','Tipe','Catatan'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {feedbackList.map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{item.klien?.nama_lengkap||'-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', gap:'2px' }}>
                          {[1,2,3,4,5].map(s => <span key={s} style={{ color: s<=(item.rating||0)?'#f59e0b':'var(--border)', fontSize:'14px' }}>★</span>)}
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', textTransform:'capitalize' }}>{item.tipe||'-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.catatan||'-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB REPORT */}
      {activeTab === 'report' && (
        <div className="space-y-3">
          {loadingReport ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Memuat report...</div>
          ) : report ? (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'12px' }}>
                {[
                  { label:'Total Klien', value: klien.length, color:'#ec4899' },
                  { label:'Handling', value: report.handling?.total||0, color:'#3b82f6' },
                  { label:'Deal', value: report.deal?.total||0, color:'#10b981' },
                  { label:'Loss', value: report.loss?.total||0, color:'#ef4444' },
                ].map(card => (
                  <div key={card.label} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                    <p style={{ color:'var(--text3)', fontSize:'12px', marginBottom:'6px' }}>{card.label}</p>
                    <p style={{ fontWeight:700, fontSize:'28px', color: card.color }}>{card.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)', marginBottom:'12px' }}>Konversi Rate</p>
                {[
                  { label:'Deal Rate', value: klien.length > 0 ? Math.round(((report.deal?.total||0)/klien.length)*100) : 0, color:'#10b981' },
                  { label:'Loss Rate', value: klien.length > 0 ? Math.round(((report.loss?.total||0)/klien.length)*100) : 0, color:'#ef4444' },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom:'10px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                      <span style={{ fontSize:'12px', color:'var(--text2)', fontWeight:500 }}>{item.label}</span>
                      <span style={{ fontSize:'12px', color:'var(--text3)' }}>{item.value}%</span>
                    </div>
                    <div style={{ height:'6px', background:'var(--border)', borderRadius:'3px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width: item.value+'%', background: item.color, borderRadius:'3px', transition:'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Gagal memuat report</div>
          )}
        </div>
      )}

      {/* Modal Kredensial Klien */}
      {kredensial && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--card)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'380px' }}>
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                <Check size={28} color="white"/>
              </div>
              <h3 style={{ fontWeight:700, fontSize:'17px', color:'var(--text)' }}>Klien Berhasil Didaftarkan!</h3>
            </div>
            <div style={{ background:'rgba(236,72,153,0.08)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'14px', padding:'16px', marginBottom:'16px' }}>
              {[{label:'Nama', value: kredensial.name},{label:'Email', value: kredensial.email},{label:'Password', value: kredensial.password}].map(item => (
                <div key={item.label} style={{ marginBottom:'10px' }}>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                  <p style={{ color: item.label==='Password'?'#ec4899':'var(--text)', fontSize:'14px', fontWeight:700 }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'10px', padding:'10px 12px', marginBottom:'16px' }}>
              <p style={{ color:'#f59e0b', fontSize:'12px' }}>⚠️ Catat dan bagikan ke klien. Password tidak bisa dilihat lagi.</p>
            </div>
            <button onClick={() => setKredensial(null)} style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'14px', cursor:'pointer' }}>
              Sudah Dicatat, Tutup
            </button>
          </div>
        </div>
      )}

      {/* Modal Form Order */}
      {showFormOrder && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'520px', padding:'24px', margin:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Buat Order Layanan</h2>
              <button onClick={() => setShowFormOrder(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleCreateOrder} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Klien *</label>
                  <select required value={formOrder.klien_id} onChange={e => setFormOrder(p => ({...p, klien_id: e.target.value}))} style={inp}>
                    <option value="">-- Pilih Klien --</option>
                    {klien.map((k: any) => <option key={k.id} value={k.id}>{k.nama_lengkap||k.user?.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Mitra (opsional)</label>
                  <select value={formOrder.mitra_id} onChange={e => setFormOrder(p => ({...p, mitra_id: e.target.value}))} style={inp}>
                    <option value="">-- Auto assign --</option>
                    {mitraList.map((m: any) => <option key={m.id} value={m.id}>{m.user?.name} ({m.status})</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tipe Layanan *</label>
                <select required value={formOrder.layanan_type} onChange={e => setFormOrder(p => ({...p, layanan_type: e.target.value}))} style={inp}>
                  {['homecare_harian','homecare_live_in','medical_checkup','konsultasi','fisioterapi','perawatan_luka','vaksinasi','lainnya'].map(t => (
                    <option key={t} value={t}>{t.replace(/_/g,' ')}</option>
                  ))}
                </select>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tanggal Mulai *</label>
                  <input required type="date" value={formOrder.tanggal_mulai} onChange={e => setFormOrder(p => ({...p, tanggal_mulai: e.target.value}))} style={inp} />
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tanggal Selesai</label>
                  <input type="date" value={formOrder.tanggal_selesai} onChange={e => setFormOrder(p => ({...p, tanggal_selesai: e.target.value}))} style={inp} />
                </div>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Lokasi</label>
                <input value={formOrder.lokasi} onChange={e => setFormOrder(p => ({...p, lokasi: e.target.value}))} style={inp} placeholder="Alamat layanan" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Harga/Shift (Rp) *</label>
                  <input required type="number" value={formOrder.harga_per_shift} onChange={e => setFormOrder(p => ({...p, harga_per_shift: e.target.value}))} style={inp} placeholder="150000" />
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Total Shift *</label>
                  <input required type="number" value={formOrder.total_shift} onChange={e => setFormOrder(p => ({...p, total_shift: e.target.value}))} style={inp} placeholder="1" />
                </div>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Deskripsi</label>
                <textarea value={formOrder.deskripsi} onChange={e => setFormOrder(p => ({...p, deskripsi: e.target.value}))} style={{...inp, minHeight:'60px', resize:'vertical'}} placeholder="Kebutuhan khusus..." />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => setShowFormOrder(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingOrder} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingOrder ? 'Membuat...' : 'Buat Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form Klien */}
      {showFormKlien && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px', margin:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Daftarkan Klien Baru</h2>
              <button onClick={() => setShowFormKlien(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleRegisterKlien} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {[
                { key:'nama', label:'Nama Lengkap *', type:'text', placeholder:'Nama klien' },
                { key:'email', label:'Email *', type:'email', placeholder:'email@contoh.com' },
                { key:'phone', label:'Nomor HP *', type:'text', placeholder:'08xxxxxxxxxx' },
                { key:'password', label:'Password *', type:'password', placeholder:'Min. 8 karakter' },
                { key:'alamat', label:'Alamat *', type:'text', placeholder:'Alamat lengkap' },
                { key:'kota', label:'Kota', type:'text', placeholder:'Jakarta' },
                { key:'provinsi', label:'Provinsi', type:'text', placeholder:'DKI Jakarta' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                  <input type={f.type} value={(formKlien as any)[f.key]} onChange={e => setFormKlien(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder} style={inp} />
                </div>
              ))}
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tipe Klien</label>
                <select value={formKlien.tipe} onChange={e => setFormKlien(p => ({...p, tipe: e.target.value}))} style={inp}>
                  {['individu','keluarga','rumah_sakit','panti_jompo','klinik'].map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
                <button type="button" onClick={() => setShowFormKlien(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingKlien} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingKlien ? 'Mendaftarkan...' : 'Daftarkan Klien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form Pasien */}
      {showFormPasien && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px', margin:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Daftarkan Pasien</h2>
              <button onClick={() => setShowFormPasien(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleRegisterPasien} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Klien *</label>
                <select required value={formPasien.klien_id} onChange={e => setFormPasien(p => ({...p, klien_id: e.target.value}))} style={inp}>
                  <option value="">-- Pilih Klien --</option>
                  {klien.map((k: any) => <option key={k.id} value={k.id}>{k.nama_lengkap||k.user?.name}</option>)}
                </select>
              </div>
              {[
                { key:'nama_lengkap', label:'Nama Lengkap *', type:'text', placeholder:'Nama pasien' },
                { key:'tanggal_lahir', label:'Tanggal Lahir *', type:'date', placeholder:'' },
                { key:'alamat', label:'Alamat *', type:'text', placeholder:'Alamat pasien' },
                { key:'riwayat_penyakit', label:'Riwayat Penyakit', type:'text', placeholder:'Penyakit yang pernah diderita' },
                { key:'alergi', label:'Alergi', type:'text', placeholder:'Alergi obat, makanan, dll' },
                { key:'kontak_darurat_nama', label:'Nama Kontak Darurat', type:'text', placeholder:'Nama' },
                { key:'kontak_darurat_phone', label:'HP Kontak Darurat', type:'text', placeholder:'08xxxxxxxxxx' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                  <input type={f.type} value={(formPasien as any)[f.key]} onChange={e => setFormPasien(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder} style={inp} />
                </div>
              ))}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Jenis Kelamin</label>
                  <select value={formPasien.jenis_kelamin} onChange={e => setFormPasien(p => ({...p, jenis_kelamin: e.target.value}))} style={inp}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Golongan Darah</label>
                  <select value={formPasien.golongan_darah} onChange={e => setFormPasien(p => ({...p, golongan_darah: e.target.value}))} style={inp}>
                    <option value="">-</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
                <button type="button" onClick={() => setShowFormPasien(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingPasien} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingPasien ? 'Mendaftarkan...' : 'Daftarkan Pasien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form Feedback */}
      {showFormFeedback && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', borderRadius:'20px', padding:'24px', width:'100%', maxWidth:'420px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h3 style={{ fontWeight:700, fontSize:'16px', color:'var(--text)' }}>Form Feedback Klien</h3>
              <button onClick={() => setShowFormFeedback(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', padding:'6px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={15}/></button>
            </div>
            <form onSubmit={handleSubmitFeedback} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Pilih Klien</label>
                <select required value={formFeedback.klien_id} onChange={e => setFormFeedback(p => ({...p, klien_id: e.target.value}))} style={inp}>
                  <option value="">-- Pilih Klien --</option>
                  {klien.map((k: any) => <option key={k.id} value={k.id}>{k.nama_lengkap||k.user?.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Rating</label>
                <div style={{ display:'flex', gap:'8px' }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setFormFeedback(p => ({...p, rating: String(n)}))}
                      style={{ width:'40px', height:'40px', borderRadius:'10px', border:'1px solid var(--border)', background: Number(formFeedback.rating)>=n?'rgba(245,158,11,0.2)':'var(--glass)', cursor:'pointer', color: Number(formFeedback.rating)>=n?'#f59e0b':'var(--text3)', fontWeight:700 }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Tipe Feedback</label>
                <select value={formFeedback.tipe} onChange={e => setFormFeedback(p => ({...p, tipe: e.target.value}))} style={inp}>
                  <option value="layanan">Layanan</option>
                  <option value="mitra">Mitra</option>
                  <option value="umum">Umum</option>
                </select>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Catatan</label>
                <textarea value={formFeedback.catatan} onChange={e => setFormFeedback(p => ({...p, catatan: e.target.value}))} style={{...inp, minHeight:'80px', resize:'vertical'}} placeholder="Catatan feedback..." />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => setShowFormFeedback(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingFeedback} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
                  {savingFeedback ? 'Menyimpan...' : 'Simpan Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {detail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px', maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>
                {activeTab === 'orders' || activeTab === 'layanan' ? 'Detail Order' : 'Detail'}
              </h2>
              <button onClick={() => setDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>

            {(activeTab === 'orders' || activeTab === 'layanan') ? (
              <div>
                {/* Order header */}
                <div style={{ background:'linear-gradient(135deg, #ec4899, #8b5cf6)', borderRadius:'14px', padding:'14px', marginBottom:'16px' }}>
                  <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'11px' }}>Order Number</p>
                  <p style={{ color:'white', fontWeight:700, fontSize:'16px' }}>{detail.order_number||'#'+detail.id}</p>
                  <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
                    {(() => { const cfg = statusMap[detail.status]||statusMap.pending; return (
                      <span style={{ background:'rgba(255,255,255,0.2)', color:'white', borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{cfg.label}</span>
                    ); })()}
                  </div>
                </div>

                {[
                  { label:'Klien', value: detail.klien?.nama_lengkap || detail.klien?.user?.name || '-' },
                  { label:'Mitra', value: detail.mitra?.user?.name || detail.mitra?.nama_lengkap || 'Belum assign' },
                  { label:'Pasien', value: detail.pasien?.nama_lengkap || '-' },
                  { label:'Tipe Layanan', value: (detail.tipe_layanan||'-').replace(/_/g,' ') },
                  { label:'Lokasi', value: detail.lokasi || detail.alamat_layanan || '-' },
                  { label:'Tanggal Mulai', value: detail.tanggal_mulai ? new Date(detail.tanggal_mulai).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : '-' },
                  { label:'Tanggal Selesai', value: detail.tanggal_selesai ? new Date(detail.tanggal_selesai).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : 'Ongoing' },
                  { label:'Durasi', value: detail.durasi_hari ? detail.durasi_hari+' hari' : '-' },
                  { label:'Harga/Hari', value: detail.harga_per_hari ? 'Rp '+Number(detail.harga_per_hari).toLocaleString('id') : '-' },
                  { label:'Total', value: 'Rp '+Number(detail.total||detail.total_amount||0).toLocaleString('id') },
                  { label:'Catatan', value: detail.catatan || '-' },
                ].map(item => (
                  <div key={item.label} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'120px', flexShrink:0 }}>{item.label}</span>
                    <span style={{ color:'var(--text)', fontSize:'13px', fontWeight:500, textTransform:'capitalize' }}>{item.value}</span>
                  </div>
                ))}

                <div style={{ marginTop:'16px' }}>
                  <p style={{ color:'var(--text3)', fontSize:'12px', marginBottom:'8px' }}>Update Status:</p>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    {Object.entries(statusMap).map(([s,cfg]: any) => (
                      <button key={s} onClick={() => updateLayananStatus(detail.id, s)}
                        style={{ padding:'7px 12px', borderRadius:'10px', border:'1px solid '+cfg.border, background: detail.status===s?cfg.bg:'transparent', color:cfg.color, fontSize:'11px', fontWeight:600, cursor:'pointer' }}>
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {Object.entries(detail).filter(([k]) => !['id','created_at','updated_at','deleted_at','user','klien','mitra','pasien'].includes(k)).map(([k,v]: any) => (
                  <div key={k} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'120px', textTransform:'capitalize', flexShrink:0 }}>{k.replace(/_/g,' ')}</span>
                    <span style={{ color:'var(--text)', fontSize:'13px' }}>{typeof v==='object'?'-':String(v??'-')}</span>
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
