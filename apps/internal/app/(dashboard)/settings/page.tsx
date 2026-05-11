'use client';
import { useEffect, useState } from 'react';
import { authService } from '@mikala/lib';
import { useTheme } from '@/components/ThemeProvider';
import { User, Bell, Shield, Palette, Moon, Sun, Save } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const { theme, toggle } = useTheme();
  useEffect(() => { setUser(authService.getUser()); }, []);

  const sections = [
    {
      title: 'Profil',
      icon: User,
      gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
      items: [
        { label:'Nama Lengkap', value: user?.name || '-', type:'text' },
        { label:'Email', value: user?.email || '-', type:'email' },
        { label:'Role', value: user?.role || '-', type:'text' },
      ]
    },
    {
      title: 'Notifikasi',
      icon: Bell,
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      items: [
        { label:'Notifikasi Email', value:'Aktif', type:'toggle' },
        { label:'Notifikasi Push', value:'Aktif', type:'toggle' },
      ]
    },
    {
      title: 'Keamanan',
      icon: Shield,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      items: [
        { label:'Password', value:'••••••••', type:'password' },
        { label:'Two Factor Auth', value:'Nonaktif', type:'toggle' },
      ]
    },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)' }}>Pengaturan</h1>
        <p style={{ color:'var(--text3)', fontSize:'13px', marginTop:'2px' }}>Kelola preferensi dan akun Anda</p>
      </div>

      {/* Theme Toggle */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'20px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'var(--shadow)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
          <div style={{ width:'42px', height:'42px', borderRadius:'13px', background:'linear-gradient(135deg, #f59e0b, #d97706)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Palette size={20} color="white" />
          </div>
          <div>
            <p style={{ fontWeight:600, color:'var(--text)', fontSize:'14px' }}>Tema Tampilan</p>
            <p style={{ color:'var(--text3)', fontSize:'12px' }}>{theme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}</p>
          </div>
        </div>
        <button onClick={toggle} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 16px', background: theme === 'dark' ? 'rgba(251,191,36,0.15)' : 'rgba(124,58,237,0.15)', border:`1px solid ${theme === 'dark' ? 'rgba(251,191,36,0.3)' : 'rgba(124,58,237,0.3)'}`, borderRadius:'10px', cursor:'pointer', color: theme === 'dark' ? '#fbbf24' : 'var(--purple-light)', fontWeight:600, fontSize:'13px' }}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {theme === 'dark' ? 'Terang' : 'Gelap'}
        </button>
      </div>

      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.title} style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
            <div style={{ padding:'18px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:section.gradient, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={17} color="white" />
              </div>
              <h2 style={{ fontWeight:700, color:'var(--text)', fontSize:'15px' }}>{section.title}</h2>
            </div>
            <div style={{ padding:'8px 20px 16px' }}>
              {section.items.map((item, i) => (
                <div key={item.label} style={{ padding:'12px 0', borderBottom: i < section.items.length-1 ? '1px solid var(--border)' : 'none', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px' }}>
                  <label style={{ color:'var(--text2)', fontSize:'13px', fontWeight:500, minWidth:'140px' }}>{item.label}</label>
                  {item.type === 'toggle' ? (
                    <div style={{ width:'44px', height:'24px', borderRadius:'12px', background: item.value === 'Aktif' ? 'var(--purple-light)' : 'var(--border)', cursor:'pointer', position:'relative', flexShrink:0 }}>
                      <div style={{ position:'absolute', top:'3px', left: item.value === 'Aktif' ? '23px' : '3px', width:'18px', height:'18px', borderRadius:'50%', background:'white', transition:'left 0.2s' }}/>
                    </div>
                  ) : (
                    <input type={item.type} defaultValue={item.value} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'8px 12px', color:'var(--text)', fontSize:'13px', outline:'none', flex:1, maxWidth:'240px' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <button style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 24px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'14px', color:'white', fontWeight:600, fontSize:'14px', cursor:'pointer', boxShadow:'0 4px 16px rgba(124,58,237,0.4)' }}>
        <Save size={16} />Simpan Perubahan
      </button>
    </div>
  );
}
