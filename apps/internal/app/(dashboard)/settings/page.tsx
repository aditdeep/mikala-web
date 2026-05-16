'use client';
import { useEffect, useState } from 'react';
import { authService, apiClient } from '@mikala/lib';
import { useTheme } from '@/components/ThemeProvider';
import { User, Palette, Moon, Sun, Save, CreditCard, Building2, Eye, EyeOff, Users, Plus, Trash2, Edit2, X, Check, Shield } from 'lucide-react';

const ROLE_OPTIONS = [
  { value:'manajemen',      label:'Manajemen' },
  { value:'rekrutmen',      label:'Rekrutmen' },
  { value:'training_center',label:'Training Center' },
  { value:'customer_care',  label:'Customer Care' },
  { value:'finance',        label:'Finance' },
  { value:'marketing',      label:'Marketing' },
];

const ROLE_COLORS: Record<string,string> = {
  manajemen:       '#7c3aed',
  rekrutmen:       '#0ea5e9',
  training_center: '#10b981',
  customer_care:   '#f59e0b',
  finance:         '#ef4444',
  marketing:       '#ec4899',
};

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [tab, setTab] = useState<'umum'|'users'>('umum');
  const [user, setUser] = useState<any>(null);

  // Payment settings
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [payment, setPayment] = useState({ bank_name:'', bank_account:'', bank_account_name:'', xendit_enabled:'false', xendit_secret_key:'', xendit_public_key:'' });

  // User management
  const [usersData, setUsersData] = useState<any>({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({ name:'', email:'', phone:'', role:'rekrutmen', password:'' });
  const [userSaving, setUserSaving] = useState(false);
  const [userError, setUserError] = useState('');
  const [showKredensial, setShowKredensial] = useState<any>(null);

  useEffect(() => {
    setUser(authService.getUser());
    apiClient.get('/internal/settings')
      .then((r: any) => {
        const d = r.data?.data;
        if (d) setPayment({ bank_name: d.bank_name||'', bank_account: d.bank_account||'', bank_account_name: d.bank_account_name||'', xendit_enabled: d.xendit_enabled||'false', xendit_secret_key: d.xendit_secret_key||'', xendit_public_key: d.xendit_public_key||'' });
      }).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
  }, [tab]);

  const fetchUsers = () => {
    setLoadingUsers(true);
    apiClient.get('/internal/users')
      .then((r: any) => { setUsersData(r.data?.data || {}); setLoadingUsers(false); })
      .catch(() => setLoadingUsers(false));
  };

  const handleSavePayment = async () => {
    setSaving(true);
    try {
      await apiClient.patch('/internal/settings', payment);
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal menyimpan'); }
    finally { setSaving(false); }
  };

  const handleAddUser = async () => {
    setUserSaving(true); setUserError('');
    try {
      if (editUser) {
        await apiClient.patch('/internal/users/' + editUser.id, { name: userForm.name, role: userForm.role, status: 'active', ...(userForm.password ? { password: userForm.password } : {}) });
      } else {
        await apiClient.post('/internal/users', userForm);
        setShowKredensial({ name: userForm.name, email: userForm.email, password: userForm.password });
      }
      setShowAddUser(false); setEditUser(null);
      setUserForm({ name:'', email:'', phone:'', role:'rekrutmen', password:'' });
      fetchUsers();
    } catch (err: any) { setUserError(err.response?.data?.message || 'Gagal menyimpan'); }
    finally { setUserSaving(false); }
  };

  const handleDeactivate = async (u: any) => {
    if (!confirm('Nonaktifkan user ' + u.name + '?')) return;
    try {
      await apiClient.delete('/internal/users/' + u.id);
      fetchUsers();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal'); }
  };

  const openEdit = (u: any) => {
    setEditUser(u);
    setUserForm({ name: u.name, email: u.email, phone: u.phone||'', role: u.role, password:'' });
    setShowAddUser(true);
    setUserError('');
  };

  const setP = (k: string, v: string) => setPayment(p => ({...p, [k]: v}));
  const setUF = (k: string, v: string) => setUserForm(p => ({...p, [k]: v}));
  const inp = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };
  const cardStyle = { background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' };

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)' }}>Pengaturan</h1>
        <p style={{ color:'var(--text3)', fontSize:'13px', marginTop:'2px' }}>Kelola konfigurasi sistem</p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'8px', background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', padding:'4px', width:'fit-content' }}>
        {[
          { key:'umum', label:'Umum', icon: Shield },
          { key:'users', label:'Manajemen User', icon: Users },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight: tab===t.key ? 600 : 400, background: tab===t.key ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent', color: tab===t.key ? 'white' : 'var(--text2)', transition:'all 0.2s' }}>
              <Icon size={14} />{t.label}
            </button>
          );
        })}
      </div>

      {/* TAB UMUM */}
      {tab === 'umum' && (
        <div className="space-y-5">
          {/* Theme */}
          <div style={{...cardStyle, padding:'20px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ width:'42px', height:'42px', borderRadius:'13px', background:'linear-gradient(135deg, #f59e0b, #d97706)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Palette size={20} color="white" />
              </div>
              <div>
                <p style={{ fontWeight:600, color:'var(--text)', fontSize:'14px' }}>Tema Tampilan</p>
                <p style={{ color:'var(--text3)', fontSize:'12px' }}>{theme==='dark' ? 'Mode Gelap' : 'Mode Terang'}</p>
              </div>
            </div>
            <button onClick={toggle} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 16px', background: theme==='dark' ? 'rgba(251,191,36,0.15)' : 'rgba(124,58,237,0.15)', border:'1px solid '+(theme==='dark'?'rgba(251,191,36,0.3)':'rgba(124,58,237,0.3)'), borderRadius:'10px', cursor:'pointer', color: theme==='dark'?'#fbbf24':'var(--purple-light)', fontWeight:600, fontSize:'13px' }}>
              {theme==='dark' ? <Sun size={15}/> : <Moon size={15}/>}
              {theme==='dark' ? 'Terang' : 'Gelap'}
            </button>
          </div>

          {/* Rekening */}
          <div style={cardStyle}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg, #0ea5e9, #0284c7)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Building2 size={17} color="white" />
              </div>
              <div>
                <h2 style={{ fontWeight:700, color:'var(--text)', fontSize:'15px' }}>Rekening Perusahaan</h2>
                <p style={{ color:'var(--text3)', fontSize:'11px' }}>Ditampilkan ke klien saat bayar manual</p>
              </div>
            </div>
            <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:'12px' }}>
              {[
                { key:'bank_name', label:'Nama Bank', placeholder:'Contoh: BCA, Mandiri' },
                { key:'bank_account', label:'Nomor Rekening', placeholder:'Nomor rekening' },
                { key:'bank_account_name', label:'Atas Nama', placeholder:'Nama pemilik rekening' },
              ].map(item => (
                <div key={item.key}>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>{item.label}</label>
                  <input value={payment[item.key as keyof typeof payment]} onChange={e => setP(item.key, e.target.value)} style={inp} placeholder={item.placeholder} />
                </div>
              ))}
            </div>
          </div>

          {/* Xendit */}
          <div style={cardStyle}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg, #4f46e5, #7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <CreditCard size={17} color="white" />
              </div>
              <div>
                <h2 style={{ fontWeight:700, color:'var(--text)', fontSize:'15px' }}>Payment Gateway (Xendit)</h2>
                <p style={{ color:'var(--text3)', fontSize:'11px' }}>Konfigurasi untuk pembayaran online</p>
              </div>
            </div>
            <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>Aktifkan Xendit</p>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>Tampilkan opsi bayar via Xendit ke klien</p>
                </div>
                <button onClick={() => setP('xendit_enabled', payment.xendit_enabled==='true'?'false':'true')}
                  style={{ width:'48px', height:'26px', borderRadius:'13px', background: payment.xendit_enabled==='true'?'#7c3aed':'var(--border)', cursor:'pointer', border:'none', position:'relative', flexShrink:0 }}>
                  <div style={{ position:'absolute', top:'3px', left: payment.xendit_enabled==='true'?'25px':'3px', width:'20px', height:'20px', borderRadius:'50%', background:'white', transition:'left 0.2s' }}/>
                </button>
              </div>
              {payment.xendit_enabled === 'true' && (
                <>
                  <div>
                    <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Public Key</label>
                    <input value={payment.xendit_public_key} onChange={e => setP('xendit_public_key', e.target.value)} style={inp} placeholder="xnd_public_..." />
                  </div>
                  <div>
                    <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Secret Key</label>
                    <div style={{ position:'relative' }}>
                      <input type={showSecret?'text':'password'} value={payment.xendit_secret_key} onChange={e => setP('xendit_secret_key', e.target.value)} style={{...inp, paddingRight:'40px'}} placeholder="xnd_development_..." />
                      <button onClick={() => setShowSecret(p => !p)} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)' }}>
                        {showSecret ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <button onClick={handleSavePayment} disabled={saving}
            style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 24px', background: saved?'linear-gradient(135deg, #10b981, #059669)':'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'14px', color:'white', fontWeight:600, fontSize:'14px', cursor: saving?'not-allowed':'pointer', opacity: saving?0.8:1 }}>
            <Save size={16}/>{saving?'Menyimpan...':saved?'Tersimpan!':'Simpan Perubahan'}
          </button>
        </div>
      )}

      {/* TAB USERS */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontWeight:700, fontSize:'15px', color:'var(--text)' }}>User Internal</p>
              <p style={{ color:'var(--text3)', fontSize:'12px' }}>Kelola akses per divisi</p>
            </div>
            <button onClick={() => { setShowAddUser(true); setEditUser(null); setUserForm({ name:'', email:'', phone:'', role:'rekrutmen', password:'' }); setUserError(''); }}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
              <Plus size={15}/>Tambah User
            </button>
          </div>

          {loadingUsers ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Memuat data...</div>
          ) : (
            <div className="space-y-3">
              {ROLE_OPTIONS.map(role => {
                const group = usersData[role.value];
                if (!group) return null;
                const color = ROLE_COLORS[role.value] || '#7c3aed';
                return (
                  <div key={role.value} style={cardStyle}>
                    <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:color, flexShrink:0 }}/>
                        <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>{role.label}</p>
                        <span style={{ background: color+'22', color, border:'1px solid '+color+'44', borderRadius:'8px', padding:'2px 8px', fontSize:'11px', fontWeight:600 }}>{group.total} user</span>
                      </div>
                    </div>
                    <div>
                      {group.users.map((u: any, i: number) => (
                        <div key={u.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderBottom: i < group.users.length-1 ? '1px solid var(--border)' : 'none' }}>
                          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background: color+'22', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'13px', fontWeight:700, color }}>
                            {u.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{u.name}</p>
                            <p style={{ color:'var(--text3)', fontSize:'11px', marginTop:'1px' }}>{u.email}</p>
                          </div>
                          <span style={{ padding:'3px 8px', borderRadius:'6px', fontSize:'11px', fontWeight:600, background: u.status==='active'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)', color: u.status==='active'?'#10b981':'#ef4444' }}>
                            {u.status==='active'?'Aktif':'Nonaktif'}
                          </span>
                          <div style={{ display:'flex', gap:'6px' }}>
                            <button onClick={() => openEdit(u)} style={{ padding:'6px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'8px', cursor:'pointer', color:'var(--purple-light)', display:'flex' }}>
                              <Edit2 size={13}/>
                            </button>
                            <button onClick={() => handleDeactivate(u)} style={{ padding:'6px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', cursor:'pointer', color:'#ef4444', display:'flex' }}>
                              <Trash2 size={13}/>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal Tambah/Edit User */}
      {showAddUser && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--card)', borderRadius:'20px', padding:'24px', width:'100%', maxWidth:'420px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <h3 style={{ fontWeight:700, fontSize:'17px', color:'var(--text)' }}>{editUser ? 'Edit User' : 'Tambah User Baru'}</h3>
              <button onClick={() => { setShowAddUser(false); setEditUser(null); }} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'6px', cursor:'pointer', color:'var(--text2)', display:'flex' }}>
                <X size={16}/>
              </button>
            </div>
            {userError && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'10px', padding:'10px 12px', color:'#ef4444', fontSize:'13px', marginBottom:'14px' }}>{userError}</div>}
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {[
                { key:'name', label:'Nama Lengkap', placeholder:'Nama user', type:'text' },
                ...(!editUser ? [
                  { key:'email', label:'Email', placeholder:'email@mikala.com', type:'email' },
                  { key:'phone', label:'Nomor HP', placeholder:'08xxxxxxxxxx', type:'text' },
                ] : []),
                { key:'password', label: editUser ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password', placeholder:'Min. 8 karakter', type:'password' },
              ].map(item => (
                <div key={item.key}>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>{item.label}</label>
                  <input type={item.type} value={userForm[item.key as keyof typeof userForm]} onChange={e => setUF(item.key, e.target.value)} style={inp} placeholder={item.placeholder} />
                </div>
              ))}
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Divisi / Role</label>
                <select value={userForm.role} onChange={e => setUF('role', e.target.value)} style={inp}>
                  {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
              <button onClick={() => { setShowAddUser(false); setEditUser(null); }} style={{ flex:1, padding:'11px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
              <button onClick={handleAddUser} disabled={userSaving} style={{ flex:2, padding:'11px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer', opacity: userSaving?0.7:1 }}>
                {userSaving ? 'Menyimpan...' : editUser ? 'Simpan Perubahan' : 'Tambah User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kredensial */}
      {showKredensial && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--card)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'380px' }}>
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'linear-gradient(135deg, #10b981, #059669)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                <Check size={28} color="white"/>
              </div>
              <h3 style={{ fontWeight:700, fontSize:'17px', color:'var(--text)' }}>User Berhasil Dibuat!</h3>
              <p style={{ color:'var(--text3)', fontSize:'13px', marginTop:'4px' }}>Simpan kredensial login berikut</p>
            </div>
            <div style={{ background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'14px', padding:'16px', marginBottom:'16px' }}>
              {[
                { label:'Nama', value: showKredensial.name },
                { label:'Email', value: showKredensial.email },
                { label:'Password', value: showKredensial.password },
              ].map(item => (
                <div key={item.label} style={{ marginBottom:'10px' }}>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                  <p style={{ color: item.label==='Password'?'#7c3aed':'var(--text)', fontSize:'14px', fontWeight:700, letterSpacing: item.label==='Password'?'1px':'0' }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'10px', padding:'10px 12px', marginBottom:'16px' }}>
              <p style={{ color:'#f59e0b', fontSize:'12px' }}>⚠️ Catat dan bagikan ke user. Password tidak bisa dilihat lagi setelah ditutup.</p>
            </div>
            <button onClick={() => setShowKredensial(null)} style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'14px', cursor:'pointer' }}>
              Sudah Dicatat, Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
