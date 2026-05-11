'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@mikala/lib';
import { User, Phone, Mail, LogOut, ChevronRight, Bell, Shield, HelpCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  useEffect(() => { setUser(authService.getUser()); }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/auth/login');
  };

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || 'M';

  const infoItems = [
    { icon: Mail, label:'Email', value: user?.email || '-' },
    { icon: Phone, label:'Telepon', value: user?.profile?.phone || '-' },
    { icon: User, label:'Nama Lengkap', value: user?.name || '-' },
  ];

  const menuItems = [
    { icon: Bell, label:'Notifikasi', desc:'Pengaturan pemberitahuan' },
    { icon: Shield, label:'Keamanan', desc:'Password & keamanan akun' },
    { icon: HelpCircle, label:'Bantuan', desc:'Pusat bantuan & FAQ' },
  ];

  const cardStyle: React.CSSProperties = {
    background:'var(--glass)',
    backdropFilter:'blur(20px)',
    WebkitBackdropFilter:'blur(20px)',
    border:'1px solid var(--glass-border)',
    borderRadius:'24px',
    overflow:'hidden',
  };

  return (
    <div className="p-4 pt-6 space-y-4">
      <div className="pt-4">
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Profil</h1>
      </div>

      {/* Avatar Card */}
      <div style={{
        background:'linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #ec4899 100%)',
        borderRadius:'24px',
        padding:'28px',
        textAlign:'center',
        boxShadow:'0 8px 32px rgba(124,58,237,0.4)',
        position:'relative',
        overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', top:'-30px', right:'-30px',
          width:'120px', height:'120px', borderRadius:'50%',
          background:'rgba(255,255,255,0.08)',
        }}/>
        <div style={{
          width:'80px', height:'80px', borderRadius:'24px',
          margin:'0 auto 16px',
          background:'rgba(255,255,255,0.25)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'28px', fontWeight:700, color:'white',
          border:'2px solid rgba(255,255,255,0.4)',
        }}>
          {initials}
        </div>
        <h2 className="text-white text-xl font-bold">{user?.name || 'Mitra'}</h2>
        <p className="text-purple-200 text-sm mt-1">{user?.email || ''}</p>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:'6px',
          marginTop:'12px',
          background:'rgba(255,255,255,0.15)',
          borderRadius:'10px', padding:'6px 14px',
        }}>
          <Shield size={13} color="white" />
          <span className="text-white text-xs font-medium capitalize">{user?.role || 'Mitra'}</span>
        </div>
      </div>

      {/* Info Card */}
      <div style={cardStyle}>
        {infoItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={{
              padding:'16px',
              display:'flex', alignItems:'center', gap:'14px',
              borderBottom: i < infoItems.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width:'38px', height:'38px', borderRadius:'12px', flexShrink:0,
                background:'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.15))',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon size={17} style={{ color:'var(--purple-light)' }} />
              </div>
              <div style={{ flex:1 }}>
                <p className="text-xs" style={{ color:'var(--text-muted)' }}>{item.label}</p>
                <p className="font-medium text-sm mt-0.5" style={{ color:'var(--text-primary)' }}>{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Menu Card */}
      <div style={cardStyle}>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={item.label} style={{
              width:'100%', padding:'15px 16px',
              display:'flex', alignItems:'center', gap:'14px',
              borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none',
              background:'transparent', cursor:'pointer', textAlign:'left',
            }}>
              <div style={{
                width:'38px', height:'38px', borderRadius:'12px', flexShrink:0,
                background:'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(79,70,229,0.1))',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon size={17} style={{ color:'var(--purple-light)' }} />
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

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          width:'100%', padding:'15px',
          borderRadius:'16px',
          cursor:'pointer',
          background:'rgba(239,68,68,0.08)',
          border:'1px solid rgba(239,68,68,0.2)',
          display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
          color:'#ef4444', fontWeight:600, fontSize:'15px',
        }}
      >
        <LogOut size={18} />
        Keluar
      </button>
    </div>
  );
}
