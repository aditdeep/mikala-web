'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, authService } from '@mikala/lib';
import { User, Phone, Mail, LogOut, Shield, Edit2, Save, X, MapPin, CreditCard, Home } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mitra, setMitra] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const u = authService.getUser();
    setUser(u);
    apiClient.get('/mitra/profile')
      .then((r: any) => {
        const data = r.data?.data;
        const m = data?.mitra || data?.profile || data;
        setMitra(m);
        setForm({
          phone:        u?.phone || '',
          alamat:       m?.alamat || '',
          kota:         m?.kota || '',
          provinsi:     m?.provinsi || '',
          bank_name:    m?.bank_name || '',
          bank_account: m?.bank_account || '',
          bank_account_name: m?.bank_account_name || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await apiClient.patch('/mitra/profile', form);
      const r: any = await apiClient.get('/mitra/profile');
      const data = r.data?.data;
      setMitra(data?.mitra || data?.profile || data);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setSaving(false); }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/auth/login');
  };

  const set = (k: string, v: string) => setForm((p: any) => ({...p, [k]: v}));
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || 'M';
  const inp = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text-primary)', fontSize:'13px', outline:'none' };

  const cardStyle: React.CSSProperties = {
    background:'var(--glass)', backdropFilter:'blur(20px)',
    border:'1px solid var(--glass-border)', borderRadius:'24px', overflow:'hidden',
  };

  return (
    <div className="p-4 pt-6 space-y-4" style={{ paddingBottom:'80px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'16px' }}>
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Profil</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'12px', color:'var(--purple-light)', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
            <Edit2 size={14} />Edit
          </button>
        ) : (
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => setEditing(false)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text-muted)', fontSize:'13px', cursor:'pointer' }}>
              <X size={14} />Batal
            </button>
            <button onClick={handleSave} disabled={saving} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 12px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
              <Save size={14} />{saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan'}
            </button>
          </div>
        )}
      </div>

      {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', padding:'10px 14px', color:'#ef4444', fontSize:'13px' }}>{error}</div>}

      {/* Avatar Card */}
      <div style={{ background:'linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #ec4899 100%)', borderRadius:'24px', padding:'28px', textAlign:'center', boxShadow:'0 8px 32px rgba(124,58,237,0.4)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ width:'80px', height:'80px', borderRadius:'24px', margin:'0 auto 16px', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:700, color:'white', border:'2px solid rgba(255,255,255,0.4)' }}>
          {initials}
        </div>
        <h2 className="text-white text-xl font-bold">{user?.name || 'Mitra'}</h2>
        <p className="text-purple-200 text-sm mt-1">{user?.email || ''}</p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'12px', background:'rgba(255,255,255,0.15)', borderRadius:'10px', padding:'6px 14px' }}>
          <Shield size={13} color="white" />
          <span className="text-white text-xs font-medium">{mitra?.status || 'Mitra'}</span>
        </div>
      </div>

      {/* Info Pribadi */}
      <div style={cardStyle}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text-primary)' }}>Informasi Pribadi</p>
        </div>
        <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
          {/* Read only */}
          {[
            { icon: User, label:'Nama Lengkap', value: user?.name },
            { icon: Mail, label:'Email', value: user?.email },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(124,58,237,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={15} style={{ color:'var(--purple-light)' }} />
                </div>
                <div>
                  <p style={{ color:'var(--text-muted)', fontSize:'11px' }}>{item.label}</p>
                  <p style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:500 }}>{item.value || '-'}</p>
                </div>
              </div>
            );
          })}
          {/* Editable */}
          {[
            { key:'phone', icon: Phone, label:'Nomor HP' },
            { key:'alamat', icon: MapPin, label:'Alamat' },
            { key:'kota', icon: Home, label:'Kota' },
            { key:'provinsi', icon: MapPin, label:'Provinsi' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.key} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(124,58,237,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={15} style={{ color:'var(--purple-light)' }} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:'var(--text-muted)', fontSize:'11px' }}>{item.label}</p>
                  {editing ? (
                    <input value={form[item.key] || ''} onChange={e => set(item.key, e.target.value)} style={inp} />
                  ) : (
                    <p style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:500 }}>{form[item.key] || '-'}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Mitra */}
      <div style={cardStyle}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text-primary)' }}>Data Mitra</p>
        </div>
        <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
          {[
            { icon: User, label:'NIK', value: mitra?.nik },
            { icon: User, label:'Jenis Kelamin', value: mitra?.jenis_kelamin === 'L' ? 'Laki-laki' : mitra?.jenis_kelamin === 'P' ? 'Perempuan' : '-' },
            { icon: User, label:'Pendidikan Terakhir', value: mitra?.pendidikan_terakhir },
            { icon: Shield, label:'Status', value: mitra?.status },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(124,58,237,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={15} style={{ color:'var(--purple-light)' }} />
                </div>
                <div>
                  <p style={{ color:'var(--text-muted)', fontSize:'11px' }}>{item.label}</p>
                  <p style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:500, textTransform:'capitalize' }}>{item.value || '-'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Bank */}
      <div style={cardStyle}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text-primary)' }}>Info Bank</p>
        </div>
        <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
          {[
            { key:'bank_name', label:'Nama Bank' },
            { key:'bank_account', label:'No. Rekening' },
            { key:'bank_account_name', label:'Atas Nama' },
          ].map(item => (
            <div key={item.key} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(124,58,237,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <CreditCard size={15} style={{ color:'var(--purple-light)' }} />
              </div>
              <div style={{ flex:1 }}>
                <p style={{ color:'var(--text-muted)', fontSize:'11px' }}>{item.label}</p>
                {editing ? (
                  <input value={form[item.key] || ''} onChange={e => set(item.key, e.target.value)} style={inp} />
                ) : (
                  <p style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:500 }}>{form[item.key] || '-'}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button onClick={handleLogout} style={{ width:'100%', padding:'15px', borderRadius:'16px', cursor:'pointer', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', color:'#ef4444', fontWeight:600, fontSize:'15px' }}>
        <LogOut size={18} />Keluar
      </button>
    </div>
  );
}
