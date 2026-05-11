'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { User, Phone, Mail, MapPin, LogOut, ChevronRight, Bell, Shield, HelpCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  useEffect(() => { setUser(authService.getUser()); }, []);

  const handleLogout = async () => { await authService.logout(); router.push('/auth/login'); };
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || 'K';

  return (
    <div className="p-4 pt-6 space-y-4">
      <div className="pt-4">
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Profil</h1>
      </div>

      <div style={{ background:'linear-gradient(135deg, #10b981 0%, #059669 60%, #0d9488 100%)', borderRadius:'24px', padding:'28px', textAlign:'center', boxShadow:'0 8px 32px rgba(16,185,129,0.4)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ width:'80px', height:'80px', borderRadius:'24px', margin:'0 auto 16px', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:700, color:'white', border:'2px solid rgba(255,255,255,0.4)' }}>{initials}</div>
        <h2 className="text-white text-xl font-bold">{user?.name || 'Klien'}</h2>
        <p className="text-green-100 text-sm mt-1">{user?.email || ''}</p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'12px', background:'rgba(255,255,255,0.15)', borderRadius:'10px', padding:'6px 14px' }}>
          <User size={13} color="white" />
          <span className="text-white text-xs font-medium">{user?.profile?.type || 'Individual'}</span>
        </div>
      </div>

      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'24px', overflow:'hidden' }}>
        {[
          { icon: Mail, label:'Email', value: user?.email || '-' },
          { icon: Phone, label:'Telepon', value: user?.profile?.phone || '-' },
          { icon: MapPin, label:'Alamat', value: user?.profile?.address || '-' },
        ].map((item, i, arr) => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={{ padding:'16px', display:'flex', alignItems:'center', gap:'14px', borderBottom: i < arr.length-1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width:'38px', height:'38px', borderRadius:'12px', flexShrink:0, background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={17} style={{ color:'var(--green)' }} />
              </div>
              <div style={{ flex:1 }}>
                <p className="text-xs" style={{ color:'var(--text-muted)' }}>{item.label}</p>
                <p className="font-medium text-sm mt-0.5" style={{ color:'var(--text-primary)' }}>{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'24px', overflow:'hidden' }}>
        {[
          { icon: Bell, label:'Notifikasi', desc:'Pengaturan pemberitahuan' },
          { icon: Shield, label:'Keamanan', desc:'Password & keamanan akun' },
          { icon: HelpCircle, label:'Bantuan', desc:'Pusat bantuan & FAQ' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={item.label} style={{ width:'100%', padding:'15px 16px', display:'flex', alignItems:'center', gap:'14px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', background:'transparent', cursor:'pointer', textAlign:'left' }}>
              <div style={{ width:'38px', height:'38px', borderRadius:'12px', flexShrink:0, background:'rgba(16,185,129,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={17} style={{ color:'var(--green)' }} />
              </div>
              <div style={{ flex:1 }}>
                <p className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{item.desc}</p>
              </div>
              <ChevronRight size={16} style={{ color:'var(--text-muted)' }} />
            </button>
          );
        })}
      </div>

      <button onClick={handleLogout} style={{ width:'100%', padding:'15px', borderRadius:'16px', border:'1px solid rgba(239,68,68,0.2)', cursor:'pointer', background:'rgba(239,68,68,0.08)', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', color:'#ef4444', fontWeight:600, fontSize:'15px' }}>
        <LogOut size={18} />Keluar
      </button>
    </div>
  );
}
